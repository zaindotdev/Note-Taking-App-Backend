import { httpServer } from "./app.js";
import * as dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 5001;

connectDB().then(() => {
  httpServer.listen(port, () => {
    console.log(`⚙ Server is running on http://localhost:${port}`);
  });
});
