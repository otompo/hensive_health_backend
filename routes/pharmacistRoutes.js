import express from 'express';
import {
  getAllPatientsQueForPharmacy,
  getSinglePatientQueForPharmacy,
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
  allOrders,
  createOrder,
  // deleteOrder,
  getSingleOrder,
  myOrders,
  updateOrder,
} from '../controllers/orderController';
import { makePatientUnActive } from '../controllers/patientController';
import { isAuth, pharmacistMiddleware } from '../middlewares';

const router = express.Router();

//patients routes
router
  .route('/patient/unactive/:patientID')
  .put(isAuth, pharmacistMiddleware, makePatientUnActive);
  
router
  .route('/patients/pharmacy/que')
  .get(isAuth, pharmacistMiddleware, getAllPatientsQueForPharmacy);
router
  .route('/patient/pharmacy/:patientID')
  .get(isAuth, pharmacistMiddleware, getSinglePatientQueForPharmacy);

// drugs routes
router.route('/drug').post(isAuth, pharmacistMiddleware, createDrug);

router
  .route('/drug/:drugID')
  .patch(isAuth, uploadImage, resizeImage, pharmacistMiddleware, updateDrug);
router.route('/drug/:drugID').get(isAuth, pharmacistMiddleware, getSingleDrug);
router.route('/drugs').get(isAuth, pharmacistMiddleware, getAllDrugs);

router
  .route('/drugs/abouttoexpired')
  .get(isAuth, pharmacistMiddleware, getAllAboutToExpire);
router
  .route('/drugs/expired')
  .get(isAuth, pharmacistMiddleware, getAllExpiredDrugs);
router
  .route('/drugs/outofstock')
  .get(isAuth, pharmacistMiddleware, getAllDrugsOutOfStock);
router
  .route('/drugs/abouttooutofstock')
  .get(isAuth, pharmacistMiddleware, aboutToOutofStock);

// orders
router.route('/order').post(isAuth, pharmacistMiddleware, createOrder);
router
  .route('/order/:orderId')
  .get(isAuth, pharmacistMiddleware, getSingleOrder);
router.route('/orders').get(isAuth, pharmacistMiddleware, allOrders);
router.route('/orders/me').get(isAuth, pharmacistMiddleware, myOrders);
router.route('/order/:id').put(isAuth, pharmacistMiddleware, updateOrder);

module.exports = router;
