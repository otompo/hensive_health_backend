const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const CartItemSchema = new mongoose.Schema(
  {
    drug: { type: ObjectId, ref: 'Drug' },
    name: String,
    price: Number,
    count: Number,
  },
  { timestamps: true },
);

const CartItem = mongoose.model('CartItem', CartItemSchema);

const OrderSchema = new Schema(
  {
    drugs: [CartItemSchema],

    orderID: {
      type: String,
      trim: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true,
    },

    seller: {
      type: ObjectId,
      ref: 'User',
    },

    buyer: {
      type: ObjectId,
      ref: 'Patient',
    },

    orderDate: {
      type: Date,
      default: Date.now,
    },

    drugs: {
      type: Array,
      default: [],
    },

    totalPrice: { type: Number },
  },

  { timestamps: true },
);

export default mongoose.model('Order', OrderSchema);
