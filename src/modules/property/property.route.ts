import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { propertyController } from "./property.controller";

const router = Router();

router.post("/create", auth(Role.LANDLORD), propertyController.createProperty);
router.get("/", propertyController.getAllProperties);
router.get("/:propertyId", propertyController.getPropertyById);

export const propertyRouter = router;
