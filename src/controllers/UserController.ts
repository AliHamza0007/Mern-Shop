import { Request, Response, NextFunction } from 'express';
import { UserTypes } from '../types/types.js';
import { User } from '../models/UserModel.js';
import ErrorHandler from '../utils/Utility.class.js';
import { TryCatch } from '../middlewares/Error.js';
import fs from 'fs';
//  route is /api/v1/user/
export const newUser = TryCatch(
  async (
    req: Request<{}, {}, UserTypes>,
    res: Response,
    next: NextFunction,
  ) => {
    const { name, email, photo, gender, _id, dob } = req.body;
    console.log(req.body);

    let user = await User.findById(_id);

    if (user)
      return res.status(200).json({
        success: true,
        message: `Welcome, ${user.name}`,
      });

    if (!_id || !name || !email || !photo || !gender || !dob)
      return next(new ErrorHandler('Please add all fields', 400));

    user = await User.create({
      name,
      email,
      photo,
      gender,
      _id,
      dob: new Date(dob),
    });

    return res.status(201).json({
      success: true,
      message: `Welcome, ${user.name}`,
    });
  },
);

// Route is  /api/v1/user/
export const getAllUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const data = await User.find({});

    data
      ? res.status(201).send({
          success: true,
          message: `SuccessFully Get Users`,
          length: `${data?.length} Users Exist`,
          data,
        })
      : '';
  },
);
// Route is  /api/v1/user/:id
export const getUser = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await User.findById(req.params.id);
    if (!result) {
      return next(new ErrorHandler('InValid ID', 400));
    }

    result
      ? res.status(201).send({
          success: true,
          message: `SuccessFully Get ${result.name}`,
          result,
        })
      : '';
  },
);
//  route is /api/v1/user/:id
export const deleteUser = TryCatch(async (req, res, next) => {
  const result = await User.findById(req.params.id);

  if (!result) return next(new ErrorHandler('Invalid Id', 400));
  result &&
    fs.unlink(result?.photo, (err: NodeJS.ErrnoException | null, res: void) => {
      err ? console.log(err) : console.log(res);
    });
  await result.deleteOne();

  return res.status(200).json({
    success: true,
    message: `${result.name} Deleted Successfully`,
  });
});
