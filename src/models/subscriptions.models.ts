import mongoose, { Schema, Document } from "mongoose";
import { EnumType } from "typescript";

interface ISubscriptions extends Document {
  userId: Schema.Types.ObjectId;
  workspaceId: Schema.Types.ObjectId;
  isSubscribed: boolean;
  subscriptionStatus: string;
}

const subscriptionSchema = new Schema<ISubscriptions>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  workspaceId: {
    type: Schema.Types.ObjectId,
    ref: "Workspace",
  },
  isSubscribed: {
    type: Boolean,
    default: false,
  },
  subscriptionStatus: {
    type: String,
    enum: ["Premium", "Free"],
    default: "Free",
  },
});

export const SubscriptionModel = mongoose.model<ISubscriptions>(
  "Subscription",
  subscriptionSchema
);
