import { TErrorSources, TGenericResponse } from '../interfaces/error';

const handleDuplicateError = (err: any): TGenericResponse => {
  const match = err.message.match(/"([^"])"/);
  const extractedMessage = match && match[1];

  const errorSources: TErrorSources = [
    {
      path: ' ',
      message: `${extractedMessage} is already exist`,
    },
  ];

  const statusCode = 400;
  return {
    statusCode,
    message: 'Invalid id',
    errorSources,
  };
};
export default handleDuplicateError;
