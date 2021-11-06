import mongoose from 'mongoose';
const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const drugSchema = new Schema(
  {
    drugID: {
      type: String,
      trim: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true,
    },

    name: {
      type: String,
      trim: true,
      required: true,
    },

    description: {
      type: String,
      required: true,
      maxlength: 2000,
    },

    price: {
      type: Number,
      trim: true,
      required: true,
    },

    expireDate: {
      type: Date,
      require: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    sold: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      // required: true,
    },

    pharmacistInfo: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
  },

  { timestamps: true },
);
export default mongoose.model('Drug', drugSchema);
