import { User } from '../models/UserModel.js';
import ErrorHandler from '../utils/utility.class.js';
import { TryCatch } from './Error.js';
export const IsAdmin = () => TryCatch(async (req, res, next) => {
    const Exist = await User.findById(req.query.id);
    if (!Exist) {
        return next(new ErrorHandler('Invalid Admin not Exist', 401));
    }
    if (Exist.role !== 'admin') {
        return next(new ErrorHandler('Invalid Not Admin', 403));
    }
    next();
});
