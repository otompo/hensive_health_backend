import express from 'express';
import {
  addPatientConsultancyRecords,
  getSinglePatientConsultancyRecords,
  PatientLabTestActive,
  PatientAdmittedActive,
  PatientEmergencyActive,
  PatientPharmacyActive,
  PatientLabTestUnActive,
  PatientAdmittedUnActive,
  PatientEmergencyUnActive,
  PatientPharmacyUnActive,
  getAllActivePatientsQueForConsultancy,
} from '../controllers/consultancyController';
import { isAuth, doctorMiddleware } from '../middlewares';

const router = express.Router();

// consultancy

router
  .route('/patients/consultancy')
  .get(isAuth, doctorMiddleware, getAllActivePatientsQueForConsultancy);

router
  .route('/patient/consultancy/:patientID')
  .get(isAuth, doctorMiddleware, getSinglePatientConsultancyRecords);

router
  .route('/patient/consultancy/:patientID')
  .post(isAuth, doctorMiddleware, addPatientConsultancyRecords);

// ***********************************Active*********************************************************
router
  .route('/patient/consultancy/labtest/:patientID')
  .put(isAuth, doctorMiddleware, PatientLabTestActive);

router
  .route('/patient/consultancy/admitted/:patientID')
  .put(isAuth, doctorMiddleware, PatientAdmittedActive);

router
  .route('/patient/consultancy/emergency/:patientID')
  .put(isAuth, doctorMiddleware, PatientEmergencyActive);

router
  .route('/patient/consultancy/pharmacy/:patientID')
  .put(isAuth, doctorMiddleware, PatientPharmacyActive);

// *****************************************Un Active*********************************************************
router
  .route('/patient/consultancy/:patientID/labtest')
  .put(isAuth, doctorMiddleware, PatientLabTestUnActive);

router
  .route('/patient/consultancy/:patientID/admitted')
  .put(isAuth, doctorMiddleware, PatientAdmittedUnActive);

router
  .route('/patient/consultancy/:patientID/emergency')
  .put(isAuth, doctorMiddleware, PatientEmergencyUnActive);

router
  .route('/patient/consultancy/:patientID/pharmacy')
  .put(isAuth, doctorMiddleware, PatientPharmacyUnActive);

module.exports = router;
