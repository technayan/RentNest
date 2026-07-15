import Stripe from "stripe";
import { PaymentStatus, PropertyStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

export const handleSessionComplete = async (
  session: Stripe.Checkout.Session,
) => {
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { stripe_session_id: session.id },
      data: {
        status: PaymentStatus.COMPLETED,
        paid_at: new Date(),
        method: session.payment_method_types[0],
        provider: "stripe",
      },
    });

    await tx.rentalRequest.update({
      where: { id: session.metadata?.requestId },
      data: {
        is_paid: true,
      },
    });

    await tx.property.update({
      where: { id: session.metadata?.property_id },
      data: {
        availability_status: PropertyStatus.RENTED,
      },
    });
  });
};

export const handleSessionExpired = async (
  session: Stripe.Checkout.Session,
) => {
  await prisma.payment.update({
    where: { stripe_session_id: session.id },
    data: {
      status: PaymentStatus.FAILED,
    },
  });
};

export const handlePaymentFailed = async (session: Stripe.PaymentIntent) => {
  await prisma.payment.update({
    where: { stripe_session_id: session.id },
    data: {
      status: PaymentStatus.FAILED,
    },
  });
};
