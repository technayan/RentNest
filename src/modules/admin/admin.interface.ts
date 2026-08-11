import { UserWhereInput } from "../../../generated/prisma/models";

export interface IUserQuery extends UserWhereInput {
  searchTerm?: string;
  page?: string;
  limit?: string;
  sortOrder?: string;
  sortBy?: string;
}
