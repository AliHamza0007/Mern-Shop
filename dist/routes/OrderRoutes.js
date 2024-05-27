import express from 'express';
import { allOrders, deleteOrder, getSingleOrder, myOrders, newOrder, processOrder, } from '../controllers/OrderController.js';
import { IsAdmin } from '../middlewares/Auth.js';
const Router = express.Router();
// route - /api/v1/order/new
Router.post('/new', newOrder);
// route - /api/v1/order/my
Router.get('/my', myOrders);
// route - /api/v1/order/my
Router.get('/all', IsAdmin(), allOrders);
Router
    .route('/:id')
    .get(getSingleOrder)
    .put(IsAdmin(), processOrder)
    .delete(IsAdmin(), deleteOrder);
export default Router;
