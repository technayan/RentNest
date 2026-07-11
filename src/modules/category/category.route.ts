import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { auth } from "../../middlewares/auth";
import { categoryController } from "./category.controller";

const router = Router();

router.post("/create", auth(Role.ADMIN), categoryController.createCategory);

export const categoryRouter = router;
