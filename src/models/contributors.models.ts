import mongoose, { Schema, Document } from "mongoose";

export interface IContributor extends Document {
  userId: Schema.Types.ObjectId[];
  workspaceId: Schema.Types.ObjectId;
  admin: boolean;
}

const contributorSchema = new Schema<IContributor>({
  userId: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
  },
  admin: {
    type: Boolean,
    default: false,
  },
});

export const ContributorModel = mongoose.model<IContributor>(
  "Contributor",
  contributorSchema
);
