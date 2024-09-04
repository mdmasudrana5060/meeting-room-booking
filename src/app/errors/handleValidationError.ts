import mongoose from 'mongoose';
import { TErrorSources, TGenericResponse } from '../interfaces/error';

const handleValiddationError = (
  err: mongoose.Error.ValidationError,
): TGenericResponse => {
  const errorSources: TErrorSources = Object.values(err?.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.path,
      };
    },
  );
  const statusCode = 400;
  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleValiddationError;
