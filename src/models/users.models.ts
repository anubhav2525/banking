import mongoose, { Schema, Document } from "mongoose";

export interface Users extends Document {
  email: string;
  password?: string;
  verifyCode?: string;
  emailVerified?: Date;
  provider?: "credentials" | "github" | "google" | string;
  createdAt: Date;
  lastModified: Date;
}

const UserSchema = new Schema<Users>({
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: function (v: string) {
        return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters long"],
  },
  emailVerified: {
    type: Date,
    required: false,
  },
  provider: {
    type: String,
    enum: ["credentials", "github", "google"],
    default: "credentials",
  },
  verifyCode: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

const UsersModel =
  (mongoose.models.Users as mongoose.Model<Users>) ||
  mongoose.model<Users>("Users", UserSchema);

export default UsersModel;
