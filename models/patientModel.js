import mongoose from 'mongoose';
import { nanoid } from 'nanoid';

const { Schema } = mongoose;
const { ObjectId } = mongoose.Schema;

// consultancy Schema

const consultancySchema = new Schema(
  {
    consultancyID: {
      type: String,
      trim: true,
      max: 32,
      // unique: true,
      index: true,
      lowercase: true,
    },
    // name: { type: String, required: true },
    complain: {
      type: {},
      required: true,
      trim: true,
    },
    prescription: {
      type: {},
      trim: true,
    },
    doctorInfo: {
      type: ObjectId,
      ref: 'User',
    },
  },

  { timestamps: true },
);

// lab Test Schema

const labTestResultSchema = new Schema(
  {
    latbtestID: {
      type: String,
      trim: true,
      max: 32,
      index: true,
      lowercase: true,
    },
    results: {
      type: {},
      required: true,
      trim: true,
    },
    createdBy: {
      type: ObjectId,
      ref: 'User',
    },
  },

  { timestamps: true },
);

// ward Schema;

const wardSchema = new Schema(
  {
    roomID: {
      type: String,
      trim: true,
      max: 32,
      // unique: true,
      index: true,
      lowercase: true,
    },
    roomNumber: {
      type: Number,
    },
  },

  { timestamps: true },
);

// opd Schema;

const opdSchema = new Schema(
  {
    opdID: {
      type: String,
      trim: true,
      max: 32,
      // unique: true,
      index: true,
      lowercase: true,
    },
    weight: {
      type: Number,
      trim: true,
      required: true,
    },
    temperature: {
      type: Number,
      trim: true,
      required: true,
    },
    pulse: {
      type: Number,
      trim: true,
      required: true,
    },
    respiratoryRate: {
      type: String,
      trim: true,
      required: true,
    },
    bloodPressure: {
      type: String,
      trim: true,
      required: true,
    },
    nurseInfo: {
      type: ObjectId,
      ref: 'User',
    },
    opdActive: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

// patients Schema;
const patientSchema = new Schema(
  {
    _id: {
      type: String,
      default: () => nanoid(),
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isLabTest: {
      type: Boolean,
      default: false,
    },
    isAdmitted: {
      type: Boolean,
      default: false,
    },
    isEmergency: {
      type: Boolean,
      default: false,
    },
    isPharmacy: {
      type: Boolean,
      default: false,
    },
    patientID: {
      type: String,
      trim: true,
      max: 32,
      unique: true,
      index: true,
      lowercase: true,
    },
    patientsInfo: {
      nationalID: { type: String, trim: true },
      nhisID: { type: String, trim: true },
      otherID: { type: String, trim: true },
      firstName: {
        type: String,
        // required: true,
        trim: true,
      },
      lastName: {
        type: String,
        // required: true,
        trim: true,
      },
      middleName: { type: String, trim: true },
      dateOfBirth: {
        type: Date,
        trim: true,
        // required: true,
      },
      gender: {
        type: [String],
        enum: ['Male', 'Female'],
        // required: true,
      },
      maritalSatus: {
        type: [String],
        enum: ['Single', 'Married', 'Divorced', 'Widowed'],
        // required: true,
      },
      occupation: {
        type: String,
        // required: true,
      },
      citizenship: {
        type: String,
        // required: true,
      },
      languages: {
        type: [String],
        // required: true,
      },
      city: {
        type: String,
        // required: true,
      },
      phoneNumberOne: {
        type: String,
        // required: true,
      },
      phoneNumbertwo: {
        type: String,
        // required: true,
      },
      email: {
        type: String,
        // required: true,
      },
      region: {
        type: String,
        // required: true,
      },
      postalAddress: {
        type: String,
        // required: true,
      },
      houseNo: {
        type: String,
        // required: true,
      },
      nextOFkinFulName: {
        type: String,
        trim: true,
        // required: true,
      },
      nextOFkinContact: {
        type: String,
        trim: true,
        // required: true,
      },
      nextOFkinEmail: {
        type: String,
        trim: true,
        // required: true,
      },
      emergencyContOnename: {
        type: String,
        trim: true,
        // required: true,
      },
      emergencyContOneNumber: {
        type: String,
        trim: true,
        // required: true,
      },
      emergencyContOneEmail: {
        type: String,
        trim: true,
        // required: true,
      },
      emergencyContTwoname: { type: String, trim: true },
      emergencyContTwoNumber: { type: String, trim: true },
      emergencyContTwoEmail: { type: String, trim: true },
      cashandcarry: { type: Boolean },
      country: { type: String },
      privateInsurance: {
        type: [String],
        enum: ['Glico', 'Acacia', 'Primea'],
        // required: true,
      },
      billingCategory: {
        type: [String],
        enum: ['Dependent', 'Employee', 'Divorced', 'Widowed'],
        // required: true,
      },
    },

    image: {
      type: String,
      default: '/images/avatar.png',
    },

    createdBy: {
      type: ObjectId,
      ref: 'User',
    },
    opd: [opdSchema],
    consultancy: [consultancySchema],
    labTestResults: [labTestResultSchema],
    ward: [wardSchema],
  },
  { timestamps: true },
);

export default mongoose.model('Patient', patientSchema);
