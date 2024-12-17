import express from "express";
import userRouter from "./routes/userRoutes.js";
import availabilityRouter from "./routes/availabilityRouter.js";
import cors from "cors";
import appointmentRouter from "./routes/appointmentRouter.js";

import { connection } from "./DB/connection.js";
import cookieParser from "cookie-parser";
import { config } from "dotenv";


const app = express();

config({
    path:"./config/config.env"
})

app.use(cors({ origin: "http://localhost:3000", credentials: true }));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/v1/user",userRouter);
app.use("/api/v1/availability",availabilityRouter);
app.use("/api/v1/appointment",appointmentRouter);

connection();
export default app;