import mongoose, { Schema, Document } from "mongoose";

interface IWorkspaces extends Document {
  workspaceName: string;
  userId: Schema.Types.ObjectId;
  files: Schema.Types.ObjectId[];
}

const workspaceSchema = new Schema<IWorkspaces>(
  {
    workspaceName: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    files: [{ type: Schema.Types.ObjectId, ref: "File" }],
  },
  { timestamps: true }
);

export const WorkspaceModel = mongoose.model<IWorkspaces>(
  "Workspace",
  workspaceSchema
);
