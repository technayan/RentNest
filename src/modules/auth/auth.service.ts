import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwtUtils";
import {
  ILoginPayload,
  IRegisterPayload,
  IUpdateUserPayload,
} from "./auth.interface";

// Register User
const registerUserIntoDB = async (payload: IRegisterPayload) => {
  const { name, email, phone, password, role, profile_photo } = payload;

  if (role === "ADMIN") {
    throw new Error(
      "You can not open an admin account without another admin's permission.",
    );
  }

  const isUserExist = await prisma.user.findUnique({
    where: { email },
  });

  if (isUserExist) {
    throw new Error("User with this email is already exist!");
  }

  const hashedPassword = await bcrypt.hash(
    password,
    Number(config.bcrypt_salt_round),
  );

  const user = await prisma.user.create({
    data: {
      name,
      email,
      phone,
      password: hashedPassword,
      role,
      profile_photo,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

// Login User
const userLoginIntoDB = async (payload: ILoginPayload) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  if (user.status === "BAN") {
    throw new Error("You account has been banned! Please, contact support.");
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Incorrect password!");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };

  const accessToken = jwtUtils.signToken(
    jwtPayload,
    config.jwt_access_token_secret,
    config.jwt_access_token_expires_in,
  );

  const refreshToken = jwtUtils.signToken(
    jwtPayload,
    config.jwt_refresh_token_secret,
    config.jwt_refresh_token_expires_in,
  );

  return { accessToken, refreshToken };
};

// Get My Profile
const getMyProfileFromDB = async (userId: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: { id: userId },
    omit: { password: true },
  });

  return user;
};

// Update User
const updateUserIntoDB = async (
  payload: IUpdateUserPayload,
  userId: string,
) => {
  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: payload,
    omit: { password: true },
  });

  return updatedUser;
};

export const authService = {
  registerUserIntoDB,
  userLoginIntoDB,
  getMyProfileFromDB,
  updateUserIntoDB,
};
