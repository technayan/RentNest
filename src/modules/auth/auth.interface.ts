import { Role } from "../../../generated/prisma/enums";

export interface IRegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: Role;
  profile_photo?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
