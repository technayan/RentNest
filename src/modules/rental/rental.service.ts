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

export const rentalService = {
  createRentalRequestIntoDB,
};
