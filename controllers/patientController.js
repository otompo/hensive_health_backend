import shortId from 'shortid';
import Patient from '../models/patientModel';

export const registerPatient = async (req, res) => {
  try {
    // console.log(req.body);
    // return;
    // let prefix = new String('HHI-');
    let patientID = shortId.generate();
    const patient = await new Patient({
      createdBy: req.user._id,
      patientID,
      ...req.body,
    }).save();

    res.json(patient);
  } catch (err) {
    console.log(err.message);
  }
};

export const makePatientActive = async (req, res) => {
  try {
    const { patientID } = req.params;
    const user = await Patient.findOne({ patientID }).exec();
    if (!user) return res.status(400).send('Patient not found');
    const updated = await Patient.findOneAndUpdate(
      { patientID },
      { isActive: true },
      { new: true },
    ).exec();
    if (!updated) return res.status(400).send('Can not make patient active');
    res.send(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Patient  failed to active' });
  }
};

export const makePatientUnActive = async (req, res) => {
  try {
    const { patientID } = req.params;
    const user = await Patient.findOne({ patientID }).exec();
    if (!user) return res.status(400).send('Patient not found');
    const updated = await Patient.findOneAndUpdate(
      { patientID },
      { isActive: false },
      { new: true },
    ).exec();
    if (!updated) return res.status(400).send('Can not make patient unactive');
    res.send(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Patient  failed to unactive' });
  }
};

export const getAllPatients = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Patient.count({});
    const patients = await Patient.find({})
      .populate('createdBy', '_id name')
      .populate('consultancy.doctorInfo', '_id name role username')
      .populate('opd.nurseInfo', '_id name role username')
      .sort({ createdAt: -1 })
      .skip(pageSize * (page - 1))
      .limit(pageSize)
      .exec();
    if (!patients) return res.status(400).send('Patients not found');
    res.send({
      total: patients.length,
      page,
      pages: Math.ceil(count / pageSize),
      patients,
    });
  } catch (err) {
    console.log(err.message);
  }
};

export const getSinglePatient = async (req, res) => {
  try {
    const { patientID } = req.params;
    const patient = await Patient.findOne({ patientID })
      .populate('createdBy', '_id name')
      .populate('opd.nurseInfo', '_id name')
      .populate('consultancy.doctorInfo', '_id name')
      .exec();
    if (!patient) return res.status(400).send('Patient not found');
    res.send(patient);
  } catch (err) {
    console.log(err.message);
  }
};

export const getSingleActivePatient = async (req, res) => {
  try {
    const { patientID } = req.params;
    const patient = await Patient.findOne({ patientID, isActive: true })
      .populate('createdBy', '_id name')
      .exec();
    if (!patient) return res.status(400).send('Patient not found');
    res.send(patient);
  } catch (err) {
    console.log(err.message);
  }
};

export const patientsStats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
  try {
    const patients = await Patient.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(patients);
  } catch (err) {
    res.status(500).json(err);
  }
};
