import { PropertyStatus } from "../../../generated/prisma/enums";

export interface ICreatePropertyPayload {
  title: string;
  category?: string;
  property_image: string;
  description: string;
  price: number;
  location: string;
}

export interface IUpdatePropertyPayload {
  title?: string;
  category?: string;
  property_image?: string;
  description?: string;
  price?: number;
  location?: string;
  availability_status?: PropertyStatus;
}
