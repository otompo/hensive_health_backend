import express from 'express';
import {
  addOPDPatientRecords,
  getSinglePatientOPDRecords,
  getAllActivePatientsQueForOPD,
} from '../controllers/opdController';
import { makePatientUnActive } from '../controllers/patientController';
import { isAuth, nurseMiddleware } from '../middlewares';

const router = express.Router();

// OPD
router
  .route('/patients/opd')
  .get(isAuth, nurseMiddleware, getAllActivePatientsQueForOPD);

router
  .route('/patient/opd/:patientID')
  .post(isAuth, nurseMiddleware, addOPDPatientRecords);

router
  .route('/patient/opd/:patientID')
  .get(isAuth, nurseMiddleware, getSinglePatientOPDRecords);

//patients
router
  .route('/patient/unactive/:patientID')
  .put(isAuth, nurseMiddleware, makePatientUnActive);

module.exports = router;
