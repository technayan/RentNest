export interface IRegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  profile_photo?: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
