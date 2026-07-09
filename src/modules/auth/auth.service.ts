import bcrypt from "bcryptjs";
import config from "../../config";
import { prisma } from "../../lib/prisma";
import { IRegisterPayload } from "./auth.interface";

const registerUserIntoDB = async (payload: IRegisterPayload) => {
  const { name, email, phone, password, profile_photo } = payload;

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
      profile_photo,
    },
    omit: {
      password: true,
    },
  });

  return user;
};

export const authService = {
  registerUserIntoDB,
};
