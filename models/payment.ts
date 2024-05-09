import mongoose from "mongoose";

const Schema = mongoose.Schema;

const paymentSchema = new Schema(
  {
    product: {
      type: String,
      required: true,
    },
    txnID: {
      type: String,
      required: true,
    },
    userID: { type: String, required: true },
    amount: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    mobile: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  // {
  //   product: {
  //     type: Schema.Types.ObjectId,
  //     ref: "Product",
  //   },
  //   user: {
  //     type: Schema.Types.ObjectId,
  //     ref: "User",
  //   },
  // },
  {
    timestamps: true,
  }
);

export default mongoose.model("Payment", paymentSchema);
