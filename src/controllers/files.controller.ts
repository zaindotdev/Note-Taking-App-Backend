import { FileModel } from "../models/files.models.js";
import { AsyncHandler } from "../utils/AsyncHandler.js";
import { httpResponse } from "../utils/httpResponse.js";
import type { Request, Response } from "express";
import mongoose from "mongoose";

export const getFiles = AsyncHandler(async (req: Request, res: Response) => {
  const user = req.user;
  const files = await FileModel.find({
    userId: user?._id,
  });

  if (!files) {
    return res.status(400).json(httpResponse(400, "No files found", null));
  }

  return res.status(200).json(httpResponse(200, "Files are found", files));
});

export const getFilesById = AsyncHandler(
  async (req: Request, res: Response) => {
    const user = req.user;
    const { id } = req.params;

    if (!user) {
      return res.status(401).json(httpResponse(401, "Unauthorized"));
    }

    if (!id) {
      return res
        .status(400)
        .json(httpResponse(400, "No id is given in params"));
    }

    const file = await FileModel.findById(id);

    if (!file) {
      return res
        .status(400)
        .json(httpResponse(400, `File with the requested Id ${id} not found`));
    }

    return res
      .status(200)
      .json(
        httpResponse(
          200,
          `File with the requested Id ${id} has been found`,
          file
        )
      );
  }
);

export const createFile = AsyncHandler(async (req: Request, res: Response) => {
  const { filename, content, workspaceId } = req.body;
  const user = req.user;

  if (!filename || !workspaceId) {
    return res
      .status(400)
      .json(httpResponse(400, "Filename and workspace Id are required"));
  }

  if (!user) {
    return res.status(401).json(httpResponse(401, "Unauthorized"));
  }

  const file = await FileModel.create({
    filename,
    content: "",
    workspaceId,
    user: user?._id,
  });

  if (!file) {
    return res.status(400).json(httpResponse(400, "Unable to create the file"));
  }

  return res
    .status(201)
    .json(
      httpResponse(201, `File created with the user id ${user?._id}`, file)
    );
});

export const deleteFile = AsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;

  if (!id) {
    return res.status(400).json(httpResponse(400, "File id is required"));
  }

  if (!user) {
    return res.status(401).json(httpResponse(401, "Unauthorized"));
  }

  const deletedFile = await FileModel.findByIdAndDelete(id);

  if (!deletedFile) {
    return res
      .status(400)
      .json(
        httpResponse(400, `Unable to delete file with the request id ${id}`)
      );
  }

  return res
    .status(200)
    .json(
      httpResponse(200, `File deleted successfully with the request id ${id}`)
    );
});

export const updateFile = AsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = req.user;
  const { filename, content } = req.body;

  if (!user) {
    return res.status(401).json(httpResponse(401, "Unauthorized"));
  }

  if (!id) {
    return res.status(400).json(httpResponse(400, "File id is required"));
  }

  const updatedFile = await FileModel.findByIdAndUpdate(
    id,
    {
      filename,
      content,
    },
    { new: true }
  );

  if (!updatedFile) {
    return res
      .status(400)
      .json(
        httpResponse(400, `File unable to update with the requested id ${id}`)
      );
  }

  return res
    .status(200)
    .json(
      httpResponse(200, `File updated with the requested id ${id}`, updatedFile)
    );
});

export const getFileByWorkspaceId = AsyncHandler(
  async (req: Request, res: Response) => {
    const { workspaceId } = req.params;
    const user = req.user;
    if (!workspaceId) {
      return res
        .status(400)
        .json(httpResponse(400, "Workspace Id is required"));
    }

    if (!user) {
      return res.status(401).json(httpResponse(401, "Unauthorized"));
    }

    const files = await FileModel.find({
      workspaceId: new mongoose.Types.ObjectId(workspaceId),
    });

    if (!files) {
      return res.status(400).json(httpResponse(400, "Files not found"));
    }

    return res
      .status(200)
      .json(httpResponse(200, "Files found successfully", files));
  }
);
