import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { paymentController } from "./payment.controller";

const router = Router();

router.post(
  "/create/:requestId",
  auth(Role.TENANT),
  paymentController.createPaymentSession,
);

router.post("/confirm", paymentController.handleWebhook);
router.get("/", auth(Role.TENANT), paymentController.getMyPayments);

export const paymentRouter = router;
