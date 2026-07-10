import dotenv from "dotenv";
import { SignOptions } from "jsonwebtoken";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  port: process.env.PORT,
  app_url: process.env.APP_URL,
  bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
  jwt_access_token_expires_in: process.env
    .JWT_ACCESS_TOKEN_EXPIRES_IN as SignOptions,
  jwt_refresh_token_secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
  jwt_refresh_token_expires_in: process.env
    .JWT_REFRESH_TOKEN_EXPIRES_IN as SignOptions,
};
