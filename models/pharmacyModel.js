import mongoose from 'mongoose';

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

const pharmacySchema = new Schema(
  {
    pharmacyID: {
      type: String,
      trim: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true,
    },

    description: {
      type: {},
      minlength: 200,
      required: true,
    },

    createdBy: {
      type: ObjectId,
      ref: 'User',
      required: true,
    },
    patient: {
      type: ObjectId,
      ref: 'Patient',
      required: true,
    },
  },

  { timestamps: true },
);
export default mongoose.model('Pharmacy', pharmacySchema);
