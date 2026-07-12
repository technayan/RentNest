import { PropertyWhereInput } from "../../../generated/prisma/models";

export interface IPropertyQuery extends PropertyWhereInput {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
}
