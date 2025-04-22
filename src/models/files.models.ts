import mongoose, { Schema, Document } from "mongoose";

interface IFiles extends Document {
  filename: string;
  content: string;
  workspaceId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
}

const fileSchema = new Schema<IFiles>(
  {
    filename: {
      type: String,
      required: true,
    },
    content: {
      type: String,
    },
    workspaceId: {
      type: Schema.Types.ObjectId,
      ref: "Workspace",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const FileModel = mongoose.model<IFiles>("File", fileSchema);
