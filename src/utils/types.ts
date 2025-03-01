import { Request } from "express";
import { IUser } from "../models/users.models.js";

export interface RequestWithUser extends Request {
  user: IUser;
}
