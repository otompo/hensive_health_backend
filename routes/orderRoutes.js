import express from 'express';
import { createOrder } from '../controllers/orderController';

import { isAuth, pharmacistMiddleware } from '../middlewares';

const router = express.Router();

//patients
router.route('/order/:username').post(isAuth, createOrder);

module.exports = router;
