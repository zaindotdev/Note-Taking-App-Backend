import { Response } from "express";
import { WorkspaceModel } from "../models/workspaces.models.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { httpResponse } from "../utils/httpResponse.js";
import { RequestWithUser } from "../utils/types.js";
import { UserModel } from "../models/users.models.js";
import mongoose from "mongoose";

export const getUserWorkspaces = AsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const user = req.user;

    const storedUser = await UserModel.findById(user._id);

    if (!storedUser) {
      return res.status(401).json(httpResponse(401, "Unauthorized", null));
    }

    const workspaces = await WorkspaceModel.find({
      userId: new mongoose.Types.ObjectId(storedUser?._id as string),
    });

    if (!workspaces) {
      return res.status(400).json(httpResponse(400, "No Workspace found"));
    }

    return res
      .status(200)
      .json(httpResponse(200, "Workspaces found", workspaces));
  }
);

export const createWorkspace = AsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { workspaceName } = req.body;
    if (!workspaceName) {
      return res
        .status(400)
        .json(httpResponse(400, "Workspace Name is required"));
    }

    const workspace = await WorkspaceModel.create({
      workspaceName,
      userId: req.user?._id,
    });

    if (!workspace) {
      return res.status(400).json(httpResponse(400, "Workspace not created!"));
    }

    return res
      .status(201)
      .json(httpResponse(201, "Workspace created!", workspace));
  }
);

export const getWorkspaceById = AsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { workspaceId } = req.params;

    if (!workspaceId) {
      return res
        .status(400)
        .json(httpResponse(400, "Workspace Id is required"));
    }

    const workspace = await WorkspaceModel.findById(workspaceId);

    if (!workspace) {
      return res.status(400).json(httpResponse(400, "Workspace not found"));
    }

    return res
      .status(200)
      .json(httpResponse(200, "Workspace Found", workspace));
  }
);

export const getWorkspaces = AsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const workspaces = await WorkspaceModel.find();

    if (!workspaces) {
      return res.status(400).json(httpResponse(400, "Workspaces not found"));
    }

    return res
      .status(200)
      .json(httpResponse(200, "Workspaces found", workspaces));
  }
);

export const deleteWorkspace = AsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { workspaceId } = req.params;
    if (!workspaceId) {
      return res
        .status(400)
        .json(httpResponse(400, "Workspace Id is required"));
    }

    const workspace = await WorkspaceModel.findByIdAndDelete(workspaceId);

    if (!workspace) {
      return res.status(400).json(httpResponse(400, "Workspace not found"));
    }

    return res.status(200).json(httpResponse(200, "Workspace deleted"));
  }
);

export const updateWorkspace = AsyncHandler(
  async (req: RequestWithUser, res: Response) => {
    const { workspaceId } = req.params;
    const { workspaceName } = req.body;
    if (!workspaceId) {
      return res
        .status(400)
        .json(httpResponse(400, "Workspace Id is required"));
    }

    const workspace = await WorkspaceModel.findByIdAndUpdate(
      workspaceId,
      { workspaceName },
      { new: true }
    );

    if (!workspace) {
      return res.status(400).json(httpResponse(400, "Workspace not found"));
    }

    return res
      .status(200)
      .json(httpResponse(200, "Workspace updated", workspace));
  }
);
