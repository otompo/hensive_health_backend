const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema;

const OrderSchema = new Schema(
  {
    orderId: {
      type: String,
      trim: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true,
    },
    orderItems: [
      {
        name: {
          type: String,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
        },

        image: {
          type: String,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        drug: {
          type: ObjectId,
          ref: 'Drug',
        },
      },
    ],

    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },

    // paymentMethod: {
    //   type: String,
    //   required: true,
    // },

    orderStatus: {
      type: String,
      required: true,
      default: 'Processing',
    },

    paidAt: {
      type: Date,
    },

    user: {
      type: ObjectId,
      ref: 'User',
    },

    seller: {
      type: ObjectId,
      ref: 'User',
    },
  },

  { timestamps: true },
);

export default mongoose.model('Order', OrderSchema);
