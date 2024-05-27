import { Order } from './models/OrderModel.js';
import { Product } from './models/ProductModel.js';
import { User } from './models/UserModel.js';
import { calculatePercentage, getInventories } from './utils/Features.js';
let stats = {};
const today = new Date();
const sixMonthsAgo = new Date();
sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
console.log(sixMonthsAgo);
const thisMonth = {
    start: new Date(today.getFullYear(), today.getMonth(), 1),
    end: today,
};
console.log(thisMonth);
const lastMonth = {
    start: new Date(today.getFullYear(), today.getMonth() - 1, 1),
    end: new Date(today.getFullYear(), today.getMonth(), 0),
};
const thisMonthProductsPromise = Product.find({
    createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
    },
});
const lastMonthProductsPromise = Product.find({
    createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
    },
});
const thisMonthUsersPromise = User.find({
    createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
    },
});
const lastMonthUsersPromise = User.find({
    createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
    },
});
const thisMonthOrdersPromise = Order.find({
    createdAt: {
        $gte: thisMonth.start,
        $lte: thisMonth.end,
    },
});
const lastMonthOrdersPromise = Order.find({
    createdAt: {
        $gte: lastMonth.start,
        $lte: lastMonth.end,
    },
});
const lastSixMonthOrdersPromise = Order.find({
    createdAt: {
        $gte: sixMonthsAgo,
        $lte: today,
    },
});
const latestTransactionsPromise = Order.find({})
    .select(['orderItems', 'discount', 'total', 'status'])
    .limit(4);
const [thisMonthProducts, thisMonthUsers, thisMonthOrders, lastMonthProducts, lastMonthUsers, lastMonthOrders, productsCount, usersCount, allOrders, lastSixMonthOrders, categories, femaleUsersCount, latestTransaction,] = await Promise.all([
    thisMonthProductsPromise,
    thisMonthUsersPromise,
    thisMonthOrdersPromise,
    lastMonthProductsPromise,
    lastMonthUsersPromise,
    lastMonthOrdersPromise,
    Product.countDocuments(),
    User.countDocuments(),
    Order.find({}).select('total'),
    lastSixMonthOrdersPromise,
    Product.distinct('category'),
    User.countDocuments({ gender: 'female' }),
    latestTransactionsPromise,
]);
const thisMonthRevenue = thisMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
const lastMonthRevenue = lastMonthOrders.reduce((total, order) => total + (order.total || 0), 0);
const changePercent = {
    revenue: calculatePercentage(thisMonthRevenue, lastMonthRevenue),
    product: calculatePercentage(thisMonthProducts.length, lastMonthProducts.length),
    user: calculatePercentage(thisMonthUsers.length, lastMonthUsers.length),
    order: calculatePercentage(thisMonthOrders.length, lastMonthOrders.length),
};
const revenue = allOrders.reduce((total, order) => total + (order.total || 0), 0);
const count = {
    revenue,
    product: productsCount,
    user: usersCount,
    order: allOrders.length,
};
const orderMonthCounts = new Array(6).fill(0);
const orderMonthyRevenue = new Array(6).fill(0);
lastSixMonthOrders.forEach((order) => {
    const creationDate = order.createdAt;
    const monthDiff = (today.getMonth() - creationDate.getMonth() + 12) % 12;
    if (monthDiff < 6) {
        orderMonthCounts[6 - monthDiff - 1] += 1;
        orderMonthyRevenue[6 - monthDiff - 1] += order.total;
    }
});
const categoryCount = await getInventories({
    categories,
    productsCount,
});
const userRatio = {
    male: usersCount - femaleUsersCount,
    female: femaleUsersCount,
};
const modifiedLatestTransaction = latestTransaction.map((i) => ({
    _id: i._id,
    discount: i.discount,
    amount: i.total,
    quantity: i.orderItems.length,
    status: i.status,
}));
stats = {
    categoryCount,
    changePercent,
    count,
    chart: {
        order: orderMonthCounts,
        revenue: orderMonthyRevenue,
    },
    userRatio,
    latestTransaction: modifiedLatestTransaction,
};
console.log(stats);
