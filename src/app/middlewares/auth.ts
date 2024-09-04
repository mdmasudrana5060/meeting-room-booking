import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../errors/AppError';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/User/user.interface';
import { User } from '../modules/User/user.model';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    // is the token is available or not
    if (!token) {
      throw new AppError(httpStatus.UNAUTHORIZED, 'Your token is not found');
    }

    // checking the toke is valid or not

    const decoded = jwt.verify(
      token,
      config.jwt_access_secret_token as string,
    ) as JwtPayload;
    console.log(decoded);
    const { userId, userRole, iat } = decoded;

    const isUserExist = await User.findById(userId);

    if (!isUserExist) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
    }
    //checking isDeleted  field
    const isDeleted = isUserExist?.isDeleted;
    if (isDeleted) {
      throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
    }
    console.log(isUserExist);
    const passwordChangedAt = isUserExist?.passwordChangedAt;
    console.log(passwordChangedAt);
    const passwordChangedTime =
      new Date(passwordChangedAt as Date).getTime() / 1000;
    const jwtIssuedTime = iat as number;
    if (passwordChangedTime > jwtIssuedTime) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'Your password has been changed',
      );
    }
    if (requiredRoles && !requiredRoles.includes(userRole)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route',
      );
    }
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
