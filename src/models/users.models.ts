import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export interface IUser extends Document {
  name: string;
  username: string;
  email: string;
  password: string;
  refreshToken?: string;
  otp: string | null;
  otpExpiry: Date | null;
  workspaces: Schema.Types.ObjectId[];
  files: Schema.Types.ObjectId[];
  isPasswordCorrect: (password: string) => Promise<boolean>;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
    },
    otp: {
      type: String,
      default: null,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    workspaces: [
      {
        type: Schema.Types.ObjectId,
        ref: "Workspace",
      },
    ],
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: "File",
      },
    ],
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  return (this.password = await bcrypt.hash(this.password, 10));
});

userSchema.methods.isPasswordCorrect = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    { _id: this._id, name: this.name },
    process.env.ACCESS_TOKEN!,
    { expiresIn: "1h" }
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN!, {
    expiresIn: "7d",
  });
};

export const UserModel = mongoose.model<IUser>("User", userSchema);
