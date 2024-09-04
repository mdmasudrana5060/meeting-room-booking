import dotenv from 'dotenv';
import { PRECONDITION_FAILED } from 'http-status';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_pass: process.env.DEFAULT_PASS,
  jwt_access_secret_token: process.env.JWT_ACCESS_TOKEN_SECRET,
  jwt_refresh_secret_token: process.env.JWT_REFRESH_TOKEN_SECRET,
  access_expires_in: process.env.ACCESS_EXPIRES_IN,
  refresh_expires_in: process.env.REFRESH_EXPIRES_IN,
};
