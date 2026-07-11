import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { propertyController } from "./property.controller";

const router = Router();

router.post("/create", auth(Role.LANDLORD), propertyController.createProperty);
router.get("/", propertyController.getAllProperties);
router.get("/:propertyId", propertyController.getPropertyById);
router.put(
  "/:propertyId",
  auth(Role.LANDLORD),
  propertyController.updateProperty,
);
router.delete(
  "/:propertyId",
  auth(Role.LANDLORD),
  propertyController.deleteProperty,
);

export const propertyRouter = router;
