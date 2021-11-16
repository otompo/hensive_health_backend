import express from 'express';
import { addUser } from '../controllers/authController';
import {
  addPatientConsultancyRecords,
  getAllActivePatientsQueForConsultancy,
  getAllPatientsQueForPharmacy,
  getSinglePatientConsultancyRecords,
  getSinglePatientQueForPharmacy,
  PatientAdmittedActive,
  PatientAdmittedUnActive,
  PatientEmergencyActive,
  PatientEmergencyUnActive,
  PatientLabTestActive,
  PatientLabTestUnActive,
  PatientPharmacyActive,
} from '../controllers/consultancyController';
import {
  aboutToOutofStock,
  createDrug,
  getAllAboutToExpire,
  getAllDrugs,
  getAllDrugsOutOfStock,
  getAllExpiredDrugs,
  getSingleDrug,
  resizeImage,
  updateDrug,
  uploadImage,
} from '../controllers/drugsController';
import {
  addOPDPatientRecords,
  getAllActivePatientsQueForOPD,
  getSinglePatientOPDRecords,
} from '../controllers/opdController';
import {
  allOrders,
  createOrder,
  deleteOrder,
  getSingleOrder,
  myOrders,
  updateOrder,
} from '../controllers/orderController';
import {
  getAllPatients,
  getSingleActivePatient,
  getSinglePatient,
  makePatientActive,
  makePatientUnActive,
  patientsStats,
  registerPatient,
} from '../controllers/patientController';
import {
  getAdminUsers,
  getAllDoctors,
  getAllNurses,
  getAllPharmacist,
  getAllStaff,
  makeUserAdmin,
  makeUserDoctor,
  makeUserNurse,
  makeUserPharmacist,
  removeAsAdmin,
  removeAsDoctor,
  removeAsNurse,
  removeAsPharmacist,
  userstats,
} from '../controllers/userController';
import { adminMiddleware, isAuth } from '../middlewares';
import { userSignupValidator } from '../validators';
const router = express.Router();

/**
 * auth routes
 */
router
  .route('/user')
  .post(userSignupValidator, addUser);

/**
 user routes
 */
router.route('/users/admins').get(isAuth, adminMiddleware, getAdminUsers);
router.route('/users/nurses').get(isAuth, adminMiddleware, getAllNurses);
router.route('/users/doctors').get(isAuth, adminMiddleware, getAllDoctors);
router
  .route('/users/pharmacies')
  .get(isAuth, adminMiddleware, getAllPharmacist);

router
  .route('/user/:username/admin')
  .put(isAuth, adminMiddleware, makeUserAdmin);
router
  .route('/user/:username/doctor')
  .put(isAuth, adminMiddleware, makeUserDoctor);
router
  .route('/user/:username/nurse')
  .put(isAuth, adminMiddleware, makeUserNurse);
router
  .route('/user/:username/pharmacy')
  .put(isAuth, adminMiddleware, makeUserPharmacist);

router
  .route('/user/:username/remove/admin')
  .put(isAuth, adminMiddleware, removeAsAdmin);
router
  .route('/user/:username/remove/pharmacy')
  .put(isAuth, adminMiddleware, removeAsPharmacist);
router
  .route('/user/:username/remove/doctor')
  .put(isAuth, adminMiddleware, removeAsDoctor);
router
  .route('/user/:username/remove/nurse')
  .put(isAuth, adminMiddleware, removeAsNurse);
router.route('/users').get(isAuth, adminMiddleware, getAllStaff);

// User Stass routes
router.route('/users/stass').get(isAuth, adminMiddleware, userstats);

/**
 patient routes
 */
router.route('/patients').get(isAuth, adminMiddleware, getAllPatients);

router
  .route('/patient/:patientID')
  .get(isAuth, adminMiddleware, getSinglePatient);

router
  .route('/patient/:patientID/active')
  .get(isAuth, adminMiddleware, getSingleActivePatient);

router
  .route('/patient/active/:patientID')
  .put(isAuth, adminMiddleware, makePatientActive);
router
  .route('/patient/unactive/:patientID')
  .put(isAuth, adminMiddleware, makePatientUnActive);
router.route('/patient').post(isAuth, adminMiddleware, registerPatient);

// pharmacist routes
router
  .route('/patients/pharmacy/que')
  .get(isAuth, adminMiddleware, getAllPatientsQueForPharmacy);
router
  .route('/patient/pharmacy/:patientID')
  .get(isAuth, adminMiddleware, getSinglePatientQueForPharmacy);
/**
 OPD
 */

router
  .route('/patient/opd/:patientID')
  .put(isAuth, adminMiddleware, addOPDPatientRecords);

router
  .route('/patients/opd')
  .get(isAuth, adminMiddleware, getAllActivePatientsQueForOPD);

router
  .route('/patient/opd/:patientID')
  .get(isAuth, adminMiddleware, getSinglePatientOPDRecords);

// Patient Stass
router.route('/patients/stass').get(isAuth, adminMiddleware, patientsStats);

/**
  Consultancy Routes 
*/

router
  .route('/patient/consultancy/:patientID')
  .post(isAuth, adminMiddleware, addPatientConsultancyRecords);

router
  .route('/patients/consutancy')
  .get(isAuth, adminMiddleware, getAllActivePatientsQueForConsultancy);

router
  .route('/patient/consultancy/:patientID')
  .get(isAuth, adminMiddleware, getSinglePatientConsultancyRecords);

// *************************Active***************
router
  .route('/patient/consultancy/labtest/:patientID')
  .put(isAuth, adminMiddleware, PatientLabTestActive);

router
  .route('/patient/consultancy/admitted/:patientID')
  .put(isAuth, adminMiddleware, PatientAdmittedActive);

router
  .route('/patient/consultancy/emergency/:patientID')
  .put(isAuth, adminMiddleware, PatientEmergencyActive);

router
  .route('/patient/consultancy/pharmacy/:patientID')
  .put(isAuth, adminMiddleware, PatientPharmacyActive);

// ****************************Un Active**************
router
  .route('/patient/consultancy/:patientID/labtest')
  .put(isAuth, adminMiddleware, PatientLabTestUnActive);

router
  .route('/patient/consultancy/:patientID/admitted')
  .put(isAuth, adminMiddleware, PatientAdmittedUnActive);

router
  .route('/patient/consultancy/:patientID/emergency')
  .put(isAuth, adminMiddleware, PatientEmergencyUnActive);

// drugs routes
router.route('/drug').post(isAuth, createDrug);

router
  .route('/drug/:drugID')
  .patch(isAuth, adminMiddleware, uploadImage, resizeImage, updateDrug);
router.route('/drug/:drugID').get(isAuth, getSingleDrug);
router.route('/drugs').get(isAuth, getAllDrugs);

router
  .route('/drugs/abouttoexpired')
  .get(isAuth, adminMiddleware, getAllAboutToExpire);
router.route('/drugs/expired').get(isAuth, adminMiddleware, getAllExpiredDrugs);
router
  .route('/drugs/outofstock')
  .get(isAuth, adminMiddleware, getAllDrugsOutOfStock);
router
  .route('/drugs/abouttooutofstock')
  .get(isAuth, adminMiddleware, aboutToOutofStock);

// orders routes
router.route('/order').post(isAuth, adminMiddleware, createOrder);
router.route('/order/:orderId').get(isAuth, adminMiddleware, getSingleOrder);
router.route('/orders').get(isAuth, adminMiddleware, allOrders);
router.route('/orders/me').get(isAuth, adminMiddleware, myOrders);
router.route('/order/:id').put(isAuth, adminMiddleware, updateOrder);
router.route('/order/:id').delete(isAuth, adminMiddleware, deleteOrder);

module.exports = router;
