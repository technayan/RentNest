import cors from "cors";
import express, { Application, Request, Response } from "express";
import config from "./config";
import { authRouter } from "./modules/auth/auth.route";

const app: Application = express();

app.use(
  cors({
    origin: config.app_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.use("/api/auth", authRouter);

export default app;
