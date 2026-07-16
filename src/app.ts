import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { notFound } from "./middlewares/notFound";
import { adminRouter } from "./modules/admin/admin.route";
import { authRouter } from "./modules/auth/auth.route";
import { categoryRouter } from "./modules/category/category.route";
import { landlordRouter } from "./modules/landlord/landlord.route";
import { paymentRouter } from "./modules/payment/payment.route";
import { propertyRouter } from "./modules/property/property.route";
import { rentalRouter } from "./modules/rental/rental.route";
import { reviewRouter } from "./modules/review/review.route";

const app: Application = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.use("/api/auth", authRouter);
app.use("/api/properties", propertyRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/rentals", rentalRouter);
app.use("/api/landlord", landlordRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/admin", adminRouter);

app.use(notFound);
app.use(globalErrorHandler);

export default app;
