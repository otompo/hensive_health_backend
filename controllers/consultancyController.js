import shortId from 'shortid';
import Patient from '../models/patientModel';

// consultancy

export const addPatientConsultancyRecords = async (req, res) => {
  try {
    let consultancyID = shortId.generate();
    const { patientID } = req.params;
    // let id = req.params.id;
    // const { complain, prescription } = req.body;

    const patient = await Patient.findOne({
      patientID,
      isActive: true,
      'opd.opdActive': true,
    }).exec();
    if (!patient) return res.status(400).send('Patient not found');

    const consultancy = {
      // name: req.user.username,
      doctorInfo: req.user._id,
      consultancyID,
      ...req.body,
    };
    patient.consultancy.push(consultancy);
    const patientData = await patient.save();
    res.send(patientData);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Add consultancy Records failed');
  }
};

export const getAllActivePatientsQueForConsultancy = async (req, res) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Patient.count({});
    const patients = await Patient.find({
      isActive: true,
      'opd.odpActive': true,
    })
      .populate('opd.nurseInfo', '_id name role username')
      .select('_id  patientsInfo opd')
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
    return res.status(400).send('Failed to fetch patient OPD Records');
  }
};

export const getSinglePatientConsultancyRecords = async (req, res) => {
  try {
    const { patientID } = req.params;
    const patient = await Patient.findOne({
      patientID,
      isActive: true,
      'opd.opdActive': true,
    })
      .populate('consultancy.doctorInfo', '_id name role username')
      .select('_id  patientsInfo.firstName opd consultancy patientID')
      .sort({ 'consultancy.doctorInfo': -1 })
      // .sort({ createdAt: -1 })
      .exec();
    if (!patient) return res.status(400).send('Patient not found');
    res.send(patient);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Failed to fetch patient OPD Records');
  }
};
// *************************MAKE ACTIVE***********************************************************

export const PatientLabTestActive = async (req, res) => {
  try {
    const { patientID } = req.params;
    const user = await Patient.findOne({ patientID }).exec();
    if (!user) return res.status(400).send('Patient not found');
    const updated = await Patient.findOneAndUpdate(
      { patientID },
      { isLabTest: true },
      { new: true },
    ).exec();
    if (!updated) return res.status(400).send('Can not make patient active');
    res.send(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Patient  failed to active' });
  }
};

export const PatientAdmittedActive = async (req, res) => {
  try {
    const { patientID } = req.params;
    const user = await Patient.findOne({ patientID }).exec();
    if (!user) return res.status(400).send('Patient not found');
    const updated = await Patient.findOneAndUpdate(
      { patientID },
      { isAdmitted: true },
      { new: true },
    ).exec();
    if (!updated) return res.status(400).send('Can not make patient active');
    res.send(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Patient  failed to active' });
  }
};

export const PatientEmergencyActive = async (req, res) => {
  try {
    const { patientID } = req.params;
    const user = await Patient.findOne({ patientID }).exec();
    if (!user) return res.status(400).send('Patient not found');
    const updated = await Patient.findOneAndUpdate(
      { patientID },
      { isEmergency: true },
      { new: true },
    ).exec();
    if (!updated) return res.status(400).send('Can not make patient active');
    res.send(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Patient  failed to active' });
  }
};

export const PatientPharmacyActive = async (req, res) => {
  try {
    const { patientID } = req.params;
    const user = await Patient.findOne({ patientID }).exec();
    if (!user) return res.status(400).send('Patient not found');
    const updated = await Patient.findOneAndUpdate(
      { patientID },
      { isPharmacy: true },
      { new: true },
    ).exec();
    if (!updated) return res.status(400).send('Can not make patient active');
    res.send(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Patient  failed to active' });
  }
};

// **************************************MAKE UNACTIVE***********************************************************

export const PatientLabTestUnActive = async (req, res) => {
  try {
    const { patientID } = req.params;
    const user = await Patient.findOne({ patientID }).exec();
    if (!user) return res.status(400).send('Patient not found');
    const updated = await Patient.findOneAndUpdate(
      { patientID },
      { isLabTest: false },
      { new: true },
    ).exec();
    if (!updated) return res.status(400).send('Can not make patient un active');
    res.send(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Patient  failed to un active' });
  }
};

export const PatientAdmittedUnActive = async (req, res) => {
  try {
    const { patientID } = req.params;
    const user = await Patient.findOne({ patientID }).exec();
    if (!user) return res.status(400).send('Patient not found');
    const updated = await Patient.findOneAndUpdate(
      { patientID },
      { isAdmitted: false },
      { new: true },
    ).exec();
    if (!updated) return res.status(400).send('Can not make patient un active');
    res.send(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Patient  failed to un active' });
  }
};

export const PatientEmergencyUnActive = async (req, res) => {
  try {
    const { patientID } = req.params;
    const user = await Patient.findOne({ patientID }).exec();
    if (!user) return res.status(400).send('Patient not found');
    const updated = await Patient.findOneAndUpdate(
      { patientID },
      { isEmergency: false },
      { new: true },
    ).exec();
    if (!updated) return res.status(400).send('Can not make patient un active');
    res.send(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Patient  failed to un active' });
  }
};

export const PatientPharmacyUnActive = async (req, res) => {
  try {
    const { patientID } = req.params;
    const user = await Patient.findOne({ patientID }).exec();
    if (!user) return res.status(400).send('Patient not found');
    const updated = await Patient.findOneAndUpdate(
      { patientID },
      { isPharmacy: false },
      { new: true },
    ).exec();
    if (!updated) return res.status(400).send('Can not make patient un active');
    res.send(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Patient  failed to un active' });
  }
};
