import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";
import { categoryRouter } from "./modules/category/category.route";
import { landlordRouter } from "./modules/landlord/landlord.route";
import { paymentRouter } from "./modules/payment/payment.route";
import { propertyRouter } from "./modules/property/property.route";
import { rentalRouter } from "./modules/rental/rental.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use("/api/payments/confirm", express.raw({ type: "application/json" }));

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

export default app;
