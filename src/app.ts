import { EVENTS } from "./constants.js";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: "http://localhost:5173",
  },
  pingTimeout: 60000,
});

app.use(express.urlencoded({ limit: "16kb", extended: true }));
app.use(express.json({ limit: "16kb" }));
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);
app.use(cookieParser());

app.use(express.static("public"));

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on(EVENTS.JOIN, (fileId: string) => {
    if (!fileId || typeof fileId !== "string") {
      socket.emit("error", "Invalid fileId");
      return;
    }
    socket.join(fileId);
    socket.emit("joined", fileId);
  });

  socket.on(EVENTS.SEND_CHANGES, (data: string, fileId: string) => {
    if (!fileId || !data || typeof data !== "string") {
      socket.emit("error", "Invalid data or fileId");
      return;
    }
    console.log(EVENTS.SEND_CHANGES, `to ${fileId}`, data);
    socket.to(fileId).emit(EVENTS.RECEIVE_CHANGES, data, fileId);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

import userRouter from "./routes/users.routes.js";
import workspaceRouter from "./routes/workspaces.routes.js";
import fileRouter from "./routes/files.routes.js";

app.use("/api/v1/user", userRouter);
app.use("/api/v1/workspace", workspaceRouter);
app.use("/api/v1/file", fileRouter);

export { httpServer };
