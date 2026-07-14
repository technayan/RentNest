import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { reviewController } from "./review.controller";

const router = Router();

router.post("/:requestId", auth(Role.TENANT), reviewController.createReview);

export const reviewRouter = router;
