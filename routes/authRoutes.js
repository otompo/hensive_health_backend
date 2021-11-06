import express from 'express';
import { login, logout } from '../controllers/authController';

const router = express.Router();

router.route('/login').post(login);
router.route('/logout').get(logout);

module.exports = router;
