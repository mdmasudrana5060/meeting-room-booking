import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../User/user.model';
import { TLoginUser } from './auth.interface';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../../config';
import { createToken } from './auth.utils';

const loginUser = async (payload: TLoginUser) => {
  // checking user is exist or not
  const isUserExist = await User.findById(payload.id).select('+password');

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }
  //checking isDeleted  field
  const isDeleted = isUserExist?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }
  // checking password match
  const isPasswordMatched = await bcrypt.compare(
    payload?.password,
    isUserExist.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password did not matched');
  }
  const jwtPayload = {
    userId: isUserExist.id,
    userRole: isUserExist.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret_token as string,
    config.access_expires_in as string,
  );
  const refreshToken = createToken(
    jwtPayload,
    config.jwt_refresh_secret_token as string,
    config.refresh_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
  };
};

const changePassword = async (userData: JwtPayload, payload: any) => {
  const isUserExist = await User.findById(userData.userId).select('+password');

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }
  //checking isDeleted  field
  const isDeleted = isUserExist?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }
  // checking password match
  const isPasswordMatched = await bcrypt.compare(
    payload?.oldPassword,
    isUserExist.password,
  );
  if (!isPasswordMatched) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password did not matched');
  }
  const newHasedPassword = await bcrypt.hash(
    payload?.newPassword,
    Number(config.bcrypt_salt_rounds),
  );
  await User.findByIdAndUpdate(
    {
      _id: userData.userId,
      role: userData.role,
    },
    {
      password: newHasedPassword,
      passwordChangedAt: new Date(),
    },
  );
  return null;
};

const refreshToken = async (token: string) => {
  // checking the toke is valid or not

  const decoded = jwt.verify(
    token,
    config.jwt_refresh_secret_token as string,
  ) as JwtPayload;

  const { userId, iat } = decoded;

  const isUserExist = await User.findById(userId);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
  }
  //checking isDeleted  field
  const isDeleted = isUserExist?.isDeleted;
  if (isDeleted) {
    throw new AppError(httpStatus.FORBIDDEN, 'This user is deleted');
  }

  const passwordChangedAt = isUserExist?.passwordChangedAt;

  const passwordChangedTime =
    new Date(passwordChangedAt as Date).getTime() / 1000;
  const jwtIssuedTime = iat as number;
  if (passwordChangedTime > jwtIssuedTime) {
    throw new AppError(
      httpStatus.UNAUTHORIZED,
      'Your password has been changed',
    );
  }
  const jwtPayload = {
    userId: isUserExist.id,
    userRole: isUserExist.role,
  };
  const accessToken = createToken(
    jwtPayload,
    config.jwt_access_secret_token as string,
    config.access_expires_in as string,
  );
  return {
    accessToken,
  };
};

export const AuthServices = {
  loginUser,
  changePassword,
  refreshToken,
};
