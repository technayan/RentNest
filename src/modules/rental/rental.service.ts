import { RentalRequestStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

// Create Request
const createRentalRequestIntoDB = async (
  tenantId: string,
  propertyId: string,
  message: string,
) => {
  const rentalRequest = await prisma.rentalRequest.findFirst({
    where: {
      tenant_id: tenantId,
      property_id: propertyId,
      status: "PENDING",
    },
  });

  if (rentalRequest) {
    throw new Error(
      "You've already placed a rental request for this property.",
    );
  }

  const newRequest = await prisma.rentalRequest.create({
    data: {
      tenant_id: tenantId,
      property_id: propertyId,
      message: message,
    },
  });

  return newRequest;
};

// Get My Requests
const getMyRentalRequestsFromDB = async (tenantId: string) => {
  const requests = await prisma.rentalRequest.findMany({
    where: { tenant_id: tenantId },
    include: {
      property: true,
    },
  });

  return requests;
};

// Get Request By ID
const getRequestByIDFromDB = async (requestId: string) => {
  const request = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id: requestId },
    include: {
      user: {
        omit: { password: true },
      },
      property: true,
    },
  });

  return request;
};

// Update Request
const changeRequestStatusIntoDB = async (
  requestId: string,
  landLordId: string,
  status: RentalRequestStatus,
) => {
  const request = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id: requestId },
    include: {
      property: {
        include: {
          landLord: true,
        },
      },
    },
  });

  if (request.property.landLord.id != landLordId) {
    throw new Error("You've no permission to update this request");
  }

  const updatedRequest = await prisma.rentalRequest.update({
    where: { id: requestId },
    data: {
      status,
    },
  });

  return updatedRequest;
};

export const rentalService = {
  createRentalRequestIntoDB,
  getMyRentalRequestsFromDB,
  getRequestByIDFromDB,
  changeRequestStatusIntoDB,
};
