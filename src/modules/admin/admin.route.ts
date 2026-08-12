import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/users", auth(Role.ADMIN), adminController.getAllUsers);
router.patch(
  "/users/:userId",
  auth(Role.ADMIN),
  adminController.updateUserStatus,
);
router.get("/properties", auth(Role.ADMIN), adminController.getAllProperties);
router.get(
  "/pending-requests",
  auth(Role.ADMIN),
  adminController.getPendingRequests,
);
router.get("/requests", auth(Role.ADMIN), adminController.getAllRequests);
router.get("/stats", auth(Role.ADMIN), adminController.getStats);

export const adminRouter = router;
