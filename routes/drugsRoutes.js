import express from 'express';
import {
  createDrug,
  updateDrug,
  uploadImage,
  resizeImage,
  getSingleDrug,
  getAllDrugs,
} from '../controllers/drugsController';
import { isAuth, pharmacistMiddleware } from '../middlewares';

const router = express.Router();

//patients
router.route('/drug').post(isAuth, createDrug);
router
  .route('/drug/:drugID')
  .patch(isAuth, uploadImage, resizeImage, updateDrug);

router.route('/drug/:drugID').get(isAuth, getSingleDrug);
router.route('/drugs').get(isAuth, getAllDrugs);

module.exports = router;
