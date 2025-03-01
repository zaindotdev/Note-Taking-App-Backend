import mongoose, { Schema, Document } from "mongoose";

interface IMessage extends Document {
  senderId: Schema.Types.ObjectId;
  receiverId: Schema.Types.ObjectId;
  message: string;
  timestamp: Date;
  isRead: boolean;
}

const messageSchema = new Schema<IMessage>(
  {
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    message: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export const MessageModel = mongoose.model<IMessage>("Message", messageSchema);
