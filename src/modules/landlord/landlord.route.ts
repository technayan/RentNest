import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { landlordController } from "./landlord.controller";

const router = Router();

router.post(
  "/properties",
  auth(Role.LANDLORD),
  landlordController.createProperty,
);
router.put(
  "/properties/:propertyId",
  auth(Role.LANDLORD),
  landlordController.updateProperty,
);
router.delete(
  "/properties/:propertyId",
  auth(Role.LANDLORD),
  landlordController.deleteProperty,
);
router.get(
  "/requests",
  auth(Role.LANDLORD),
  landlordController.getRequestsForLandLord,
);
router.patch(
  "/requests/:requestId",
  auth(Role.LANDLORD),
  landlordController.changeRequestStatus,
);
router.get(
  "/rentals",
  auth(Role.LANDLORD),
  landlordController.getRentalHistory,
);

export const landlordRouter = router;
