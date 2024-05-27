import { TryCatch } from '../middlewares/Error.js';
import ErrorHandler from '../utils/Utility.class.js';
import { Product } from '../models/ProductModel.js';
import fs, { rm } from 'fs';
import { invalidateCache } from '../utils/Features.js';
import { myCache } from '../index.js';
// Route is  /api/v1/product/
export const getAllProducts = TryCatch(async (req, res, next) => {
    const { search, sort, category, price } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;
    const baseQuery = {};
    if (search)
        baseQuery.name = {
            $regex: search,
            $options: 'i',
        };
    if (price)
        baseQuery.price = {
            $lte: Number(price),
        };
    if (category)
        baseQuery.category = category;
    const productsPromise = Product.find(baseQuery)
        .sort(sort && { price: sort === 'asc' ? 1 : -1 })
        .limit(limit).sort({ createdAt: -1 })
        .skip(skip);
    const [products, filteredOnlyProduct] = await Promise.all([
        productsPromise,
        Product.find(baseQuery),
    ]);
    const totalPage = Math.ceil(filteredOnlyProduct.length / limit);
    return res.status(200).json({
        success: true,
        totalPage,
        products,
    });
});
// Route is    /api/v1/product/
export const newProduct = TryCatch(async (req, res, next) => {
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    if (!photo)
        return next(new ErrorHandler('Please add Photo', 400));
    if (!name || !price || !stock || !category) {
        rm(photo.path, () => {
            console.log('Deleted');
        });
        return next(new ErrorHandler('Please enter All Fields', 400));
    }
    await Product.create({
        name,
        price,
        stock,
        category: category.toLowerCase(),
        photo: photo.path,
    });
    invalidateCache({ product: true, admin: true });
    return res.status(201).send({
        success: true,
        message: 'Product Created Successfully',
    });
});
// Route is  /api/v1/product/:id
export const getSingleProduct = TryCatch(async (req, res, next) => {
    let product;
    const id = req.params.id;
    if (myCache.has(`product-${id}`))
        product = JSON.parse(myCache.get(`product-${id}`));
    else {
        product = await Product.findById(id);
        if (!product)
            return next(new ErrorHandler('Product Not Found', 404));
        myCache.set(`product-${id}`, JSON.stringify(product));
    }
    return res.status(200).json({
        success: true,
        product,
    });
});
export const deleteSingleProduct = TryCatch(async (req, res, next) => {
    const data = await Product.findByIdAndDelete(req.params.id);
    data &&
        fs.unlink(data?.photo, (err, res) => {
            err ? console.log(err) : console.log(res);
        });
    data
        ? res.status(201).send({
            success: true,
            message: `SuccessFully Delete Product`,
            data,
        })
        : res.status(200).send({
            success: false,
            message: ` Product Not Found`,
        });
    invalidateCache({
        product: true,
        admin: true,
    });
});
export const updateSingleProduct = TryCatch(async (req, res, next) => {
    const { id } = req.params;
    const { name, price, stock, category } = req.body;
    const photo = req.file;
    const product = await Product.findById(id);
    if (!product)
        return next(new ErrorHandler('Product Not Found', 404));
    if (photo) {
        rm(product.photo, () => {
            console.log('Old Photo Deleted');
        });
        product.photo = photo.path;
    }
    if (name)
        product.name = name;
    if (price)
        product.price = price;
    if (stock)
        product.stock = stock;
    if (category)
        product.category = category;
    await product.save();
    invalidateCache({
        product: true,
        productId: String(product._id),
        admin: true,
    });
    return res.status(200).json({
        success: true,
        message: 'Product Updated Successfully',
    });
});
// Route is  /api/v1/product/admin
export const getAdminProduct = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has('all-products'))
        products = JSON.parse(myCache.get('all-products'));
    else {
        products = await Product.find({}).sort({ createdAt: -1 });
        myCache.set('all-products', JSON.stringify(products));
    }
    products.length !== 0
        ? res.status(201).send({
            success: true,
            message: `Successfully Got Products`,
            length: `${products.length} Products Exist`,
            products,
        })
        : res.status(200).send({
            success: false,
            message: `Products Not Found`,
        });
});
// Route is  /api/v1/product/latest
export const getLatestProducts = TryCatch(async (req, res, next) => {
    let products;
    if (myCache.has('latest-products'))
        products = JSON.parse(myCache.get('latest-products'));
    else {
        products = await Product.find({}).sort({ createdAt: -1 }).limit(4);
        myCache.set('latest-products', JSON.stringify(products));
    }
    return res.status(200).json({
        success: true,
        products,
    });
});
// Route is  /api/v1/product/categories
export const getAllCategories = TryCatch(async (req, res, next) => {
    let categories;
    if (myCache.has('categories'))
        categories = JSON.parse(myCache.get('categories'));
    else {
        categories = await Product.distinct('category');
        myCache.set('categories', JSON.stringify(categories));
    }
    return res.status(200).json({
        success: true,
        categories,
    });
});
