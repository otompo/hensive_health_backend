import shortId from 'shortid';
import Patient from '../models/patientModel';
// OPD

export const addOPDPatientRecords = async (req, res) => {
  try {
    let opdID = shortId.generate();
    const { patientID } = req.params;
    const {
      weight,
      temperature,
      pulse,
      respiratoryRate,
      bloodPressure,
      // opdActive,
    } = req.body;

    const patient = await Patient.findOne({ patientID }).exec();
    if (!patient) return res.status(400).send('Patient not found');

    const opd = {
      nurseInfo: req.user._id,
      opdID,
      weight,
      temperature,
      pulse,
      respiratoryRate,
      bloodPressure,
      opdActive: true,
    };
    patient.opd.push(opd);
    const patientData = await patient.save();
    res.send(patientData);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Add opd Records failed');
  }
};

export const getAllActivePatientsQueForOPD = async (req, res) => {
  try {
    const pageSize = 5;
    const page = Number(req.query.pageNumber) || 1;
    const count = await Patient.count({});
    const patients = await Patient.find({ isActive: true })
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
    return res.status(400).send('Failed to fetch patients');
  }
};

export const getSinglePatientOPDRecords = async (req, res) => {
  try {
    const { patientID } = req.params;
    const patient = await Patient.findOne({ patientID, isActive: true })
      .populate('opd.nurseInfo', '_id name role username')
      .select('_id  patientsInfo.firstName  opd')
      .exec();
    if (!patient) return res.status(400).send('Patients not found');
    res.send(patient);
  } catch (err) {
    console.log(err);
    return res.status(400).send('Failed to fetch patient OPD Records');
  }
};
