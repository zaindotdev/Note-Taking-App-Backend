import { IUser } from "../models/users.models";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

declare module "socket.io" {
  interface Socket {
    user?: IUser;
  }
}

export {};
