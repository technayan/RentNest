import { PaymentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";
import { IReviewPayload } from "./review.interface";

// Create Review
const createReviewIntoDB = async (
  requestId: string,
  tenantId: string,
  payload: IReviewPayload,
) => {
  const request = await prisma.rentalRequest.findUniqueOrThrow({
    where: { id: requestId },
    include: {
      property: true,
      payment: true,
    },
  });

  if (
    request.tenant_id !== tenantId ||
    !request.payment ||
    request.payment.status !== PaymentStatus.COMPLETED
  ) {
    throw new Error("You must complete the rental to leave a review.");
  }

  if (payload.rating > 5 || payload.rating < 1) {
    throw new Error("Rating must be between 1 to 5");
  }

  const review = await prisma.review.create({
    data: {
      tenant_id: request.tenant_id,
      property_id: request.property_id,
      rental_request_id: requestId,
      rating: payload.rating,
      comment: payload.comment,
    },
  });

  return review;
};

export const reviewService = { createReviewIntoDB };
