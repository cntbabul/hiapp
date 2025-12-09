import express from "express";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import fileUpload from "express-fileupload";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";
import { errorMiddleware } from "./middlewares/error.js";

const app = express();

config({ path: "./config/config.env" });

app.use(
    cors({
        origin: [process.env.FRONTED_URL, "http://localhost:5173"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);

// middleware
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: "./temp",
    })
);

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/message", messageRouter);

app.use(errorMiddleware);

export default app;