import { Router } from "express";
import { propertyController } from "./property.controller";

const router = Router();

router.get("/", propertyController.getAllProperties);
router.get("/details/:propertyId", propertyController.getPropertyById);
router.get("/featured", propertyController.getFeaturedProperties);

export const propertyRouter = router;
