import express from 'express';

import {
  currentUser,
  // userUpdateProfile,
  userUpdatePassword,
  userUpdate,
  resizeImage,
  uploadImage,
} from '../controllers/userController';

import { isAuth } from '../middlewares';
const router = express.Router();

router.route('/user').get(isAuth, currentUser);
// router.route('/profile/:username').put(isAuth, userUpdateProfile);
router.route('/profile/password/:username').put(isAuth, userUpdatePassword);
router
  .route('/user/:username')
  .patch(isAuth, uploadImage, resizeImage, userUpdate);

module.exports = router;
