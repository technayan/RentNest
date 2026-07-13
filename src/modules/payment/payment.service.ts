import config from "../../config";
import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import {
  handlePaymentFailed,
  handleSessionComplete,
  handleSessionExpired,
} from "./payment.utills";

// Create Payment Session
const createPaymentSessionIntoStripe = async (
  requestId: string,
  tenantId: string,
) => {
  const transactionResult = await prisma.$transaction(async (tx) => {
    const request = await tx.rentalRequest.findUniqueOrThrow({
      where: { id: requestId },
      include: {
        property: true,
      },
    });

    if (request.tenant_id !== tenantId) {
      throw new Error(
        "Forbidden, You are not permitted to payment for this request!",
      );
    }

    if (request.status !== "APPROVED") {
      throw new Error(
        `Your rental request is ${request.status}. Request must be ACCEPTED before payment.`,
      );
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: request.property.title,
              description: request.property.description,
            },
            unit_amount: Number(request.property.price) * 100,
          },
          quantity: 1,
        },
      ],

      adaptive_pricing: {
        enabled: false,
      },

      success_url: `${config.app_url}/payments/success`,
      cancel_url: `${config.app_url}/payments/cancel`,

      metadata: {
        tenant_id: request.tenant_id,
        property_id: request.property_id,
        request_id: request.id,
      },
    });

    await tx.payment.create({
      data: {
        tenant_id: request.tenant_id,
        rental_request_id: requestId,
        stripe_session_id: session.id,
        amount: request.property.price,
      },
    });

    return session.url;
  });

  return { payment_url: transactionResult };
};

// Webhook
const handleWebhook = async (payload: Buffer, signature: string) => {
  const endpointSecret = config.stripe_webhook_secret;

  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endpointSecret,
  );

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      await handleSessionComplete(event.data.object);
      break;

    case "checkout.session.expired":
      await handleSessionExpired(event.data.object);
      break;

    case "payment_intent.payment_failed":
      await handlePaymentFailed(event.data.object);
      break;

    default:
      console.log(`No event matches. Unhandled event type ${event.type}`);
  }
};

// Get My Payments
const getMyPaymentsFromDB = async (tenantId: string) => {
  const payments = await prisma.payment.findMany({
    where: { tenant_id: tenantId },
  });

  return payments;
};

// Get Payment By ID
const getPaymentByIdFromDB = async (paymentId: string) => {
  const payment = await prisma.payment.findUniqueOrThrow({
    where: { id: paymentId },
  });

  return payment;
};

export const paymentService = {
  createPaymentSessionIntoStripe,
  handleWebhook,
  getMyPaymentsFromDB,
  getPaymentByIdFromDB,
};
