import express from 'express';
import { IsAdmin } from '../middlewares/Auth.js';
import {
  deleteUser,
  getAllUser,
  getUser,
  newUser,
} from '../controllers/UserController.js';
const Route = express.Router();
// route - /api/v1/user/
Route.post('/', newUser);

// Route - /api/v1/user/
Route.get('/', IsAdmin(), getAllUser);

// Route - /api/v1/user/dynamicID
Route.route('/:id').get(getUser).delete(IsAdmin(), deleteUser);

export default Route;
