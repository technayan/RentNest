import { PropertyStatus } from "../../../generated/prisma/enums";
import { PropertyWhereInput } from "../../../generated/prisma/models";

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

export interface IPropertyQuery extends PropertyWhereInput {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
}
