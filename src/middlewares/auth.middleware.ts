import jwt, { JwtPayload } from "jsonwebtoken";
import { UserModel } from "../models/users.models.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { NextFunction, Response } from "express";
import { httpResponse } from "../utils/httpResponse.js";
import { RequestWithUser } from "../utils/types.js";

export const AuthMiddleware = AsyncHandler(
  async (req: RequestWithUser, res: Response, next: NextFunction) => {
    const token =
      req.cookies?.accessToken ||
      req.headers.authorization?.split("Bearer ")[1];
    if (!token) {
      return res.status(401).json(httpResponse(401, "Unauthorized", null));
    }

    const decodedToken: string | JwtPayload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN!
    );

    const user = await UserModel.findById((decodedToken as JwtPayload)._id);
    if (!user) {
      return res.status(401).json(httpResponse(401, "Unauthorized", null));
    }

    req.user = user;
    next();
  }
);
