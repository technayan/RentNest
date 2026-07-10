import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const signToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: SignOptions,
) => {
  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn,
  } as SignOptions);

  return token;
};

const verifyToken = (token: string, secret: string) => {
  try {
    const verifiedToken = jwt.verify(token, secret);

    return {
      success: true,
      data: verifiedToken,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message,
    };
  }
};

export const jwtUtils = {
  signToken,
  verifyToken,
};
