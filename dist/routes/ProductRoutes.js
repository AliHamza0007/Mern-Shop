import express from 'express';
import { deleteSingleProduct, getAllCategories, getAdminProduct, getAllProducts, getLatestProducts, getSingleProduct, newProduct, updateSingleProduct, } from '../controllers/ProductController.js';
import { IsAdmin } from '../middlewares/Auth.js';
import { singleUpload } from '../middlewares/Multer.js';
const Route = express.Router();
Route.route('/').post(IsAdmin(), singleUpload, newProduct).get(getAllProducts);
Route.get('/latest', getLatestProducts);
Route.get('/admin', IsAdmin(), getAdminProduct);
Route.get('/categories', getAllCategories);
Route.route('/:id')
    .get(getSingleProduct)
    .delete(IsAdmin(), deleteSingleProduct)
    .put(IsAdmin(), singleUpload, updateSingleProduct);
export default Route;
