import express from "express";

const app = express();

app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.json({ limit: "16kb" }));

app.use(express.static("public"));

import userRouter from "./routes/users.routes.js";
app.use("/api/v1/user", userRouter);

export { app };
