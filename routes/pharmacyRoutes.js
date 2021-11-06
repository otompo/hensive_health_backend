import express from 'express';
import { makePatientUnActive } from '../controllers/patientController';
import { isAuth, pharmacistMiddleware } from '../middlewares';

const router = express.Router();

//patients
router
  .route('/patient/unactive/:patientID')
  .put(isAuth, pharmacistMiddleware, makePatientUnActive);

module.exports = router;
