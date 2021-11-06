import express from 'express';
import {
  registerPatient,
  makePatientActive,
  getSingleActivePatient,
  getSinglePatient,
} from '../controllers/patientController';

import { isAuth, nurseMiddleware } from '../middlewares';

const router = express.Router();

router.route('/patient').post(isAuth, nurseMiddleware, registerPatient);

router
  .route('/patient/:patientID')
  .get(isAuth, nurseMiddleware, getSinglePatient);
router
  .route('/patient/:patientID/active')
  .get(isAuth, nurseMiddleware, getSingleActivePatient);

router
  .route('/patient/active/:patientID')
  .put(isAuth, nurseMiddleware, makePatientActive);

module.exports = router;
