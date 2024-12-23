import mongoose, { Schema, Document } from "mongoose";

export interface Customer extends Document {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  contact: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: number;
    country: string;
  };
  dob: Date;
  isVerified: boolean;
}

const CustomerSchema = new Schema<Customer>({
  firstName: {
    type: String,
    required: true,
  },
  middleName: {
    type: String,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  contact: {
    type: String,
    required: true,
  },
  address: {
    street: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zip: {
      type: Number,
      required: true,
    },
    country: {
      type: String,
      default: "india",
    },
  },
  dob: {
    type: Date,
    required: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const CustomerModel =
  (mongoose.models.Customer as mongoose.Model<Customer>) ||
  mongoose.model<Customer>("Customer", CustomerSchema);

export default CustomerModel;
