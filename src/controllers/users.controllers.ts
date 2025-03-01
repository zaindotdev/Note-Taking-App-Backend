import { AsyncHandler } from "../utils/AsyncHandler.js";
import { httpResponse } from "../utils/httpResponse.js";
import type { Request, Response } from "express";
import { IUser, UserModel } from "../models/users.models.js";
import { RequestWithUser } from "../utils/types.js";
import { FileModel } from "../models/files.models.js";
import mongoose from "mongoose";
import { WorkspaceModel } from "../models/workspaces.models.js";

const generateAccessAndRefreshToken = async (userId: string) => {
  const user = await UserModel.findById(userId);
  const accessToken = await user?.generateAccessToken();
  const refreshToken = await user?.generateRefreshToken();
  return { accessToken, refreshToken };
};

export const register = AsyncHandler(async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if ([name, email, password].some((field) => !field)) {
    return res
      .status(400)
      .json(httpResponse(400, "All fields are required", null));
  }

  const existingUser = await UserModel.findOne({ email });

  if (existingUser) {
    return res.status(400).json(httpResponse(400, "User already exists", null));
  }

  const user = await UserModel.create({
    name,
    username: name.split(" ").join("").toLowerCase(),
    email,
    password,
  });

  if (!user) {
    return res.status(400).json(httpResponse(400, "User already exists", null));
  }

  const getUser = await UserModel.findById(user._id);

  return res
    .status(201)
    .json(httpResponse(201, "User created", { user: getUser }));
});

export const login = AsyncHandler(async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  if (!username && !email && !password) {
    return res
      .status(400)
      .json(httpResponse(400, "All fields are required", null));
  }

  const user = await UserModel.findOne({
    $or: [{ email: email }, { username: username }],
  }).select("+password");

  if (!user) {
    return res.status(400).json(httpResponse(400, "User does not exist", null));
  }

  const validatePassword = await user.isPasswordCorrect(password);

  if (!validatePassword) {
    return res
      .status(400)
      .json(httpResponse(400, "Password is incorrect", null));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user?._id as string
  );

  const getUser = await UserModel.findById(user._id).select("-password");

  if (!getUser) {
    return res.status(400).json(httpResponse(400, "User does not exist", null));
  }

  getUser.refreshToken = refreshToken;
  await getUser.save();
  if (!accessToken || !refreshToken) {
    return res
      .status(400)
      .json(httpResponse(400, "Unable to generate tokens", null));
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options as any)
    .cookie("refreshToken", refreshToken, options as any)
    .json(httpResponse(200, "User Logged in", { user: getUser, accessToken }));
});

export const getUser = AsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const user = req.user;
    if (!user) {
      return res.status(401).json(httpResponse(401, "Unauthorized", null));
    }

    return res.status(200).json(httpResponse(200, "User found", user));
  }
);

export const logout = AsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    if (!req.user) {
      return res.status(401).json(httpResponse(401, "Unauthorized", null));
    }

    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(httpResponse(200, "User logged out", null));
  }
);

export const getUserWorkspaces = AsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const user = req.user;

    const storedUser = await UserModel.findById(user._id);

    if (!storedUser) {
      return res.status(401).json(httpResponse(401, "Unauthorized", null));
    }

    const workspaces = await WorkspaceModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(storedUser?._id as string),
        },
      },
      {
        $project: {
          _id: 1,
          workspaceName: 1,
          files: 1,
        },
      },
    ]);

    storedUser.workspaces = workspaces;
    storedUser.save();

    return res
      .status(200)
      .json(httpResponse(200, "Workspaces found", { user: storedUser }));
  }
);

export const getUserFiles = AsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const user = req.user;
    const storedUser = await UserModel.findById(user._id);

    if (!storedUser) {
      return res.status(401).json(httpResponse(401, "Unauthorized", null));
    }
    const files = await FileModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(storedUser?._id as string),
        },
      },
      {
        $lookup: {
          from: "workspaces",
          localField: "workspaceId",
          foreignField: "_id",
          as: "workspace",
        },
      },
      {
        $project: {
          _id: 1,
          fileName: 1,
          content: 1,
          workspaceName: { $arrayElemAt: ["$workspace.workspaceName", 0] },
        },
      },
    ]);

    storedUser.files = files;
    storedUser.save();

    return res
      .status(200)
      .json(httpResponse(200, "Files found", { user: storedUser }));
  }
);
