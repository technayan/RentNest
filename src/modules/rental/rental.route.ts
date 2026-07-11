import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { rentalController } from "./rental.controller";

const router = Router();

router.post(
  "/:propertyId",
  auth(Role.TENANT),
  rentalController.createRentalRequest,
);

export const rentalRouter = router;
