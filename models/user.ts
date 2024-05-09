import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
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
  createdProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  ],
});

export default mongoose.model("User", userSchema);
