import User from '../models/userModel';
import jwt from 'jsonwebtoken';
import { hashPassword, comparePassword } from '../utils/authHelpers';
import shortId from 'shortid';

export const addUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let username = shortId.generate();

    if (!name) {
      return res.status(404).send('name is required');
    }

    let userExist = await User.findOne({ email }).exec();
    if (userExist) return res.status(400).send('Email is taken ');
    // hash password

    // register user
    const user = new User({
      email,
      name,
      username,
      password,
    });
    await user.save();
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status('404').send('Error. Try again ');
  }
};

export const login = (req, res) => {
  const { email, password } = req.body;
  // check if user exist
  User.findOne({ email }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User with that email does not exist. Please signup',
      });
    }
    // authenticate
    // authenticate
    if (!user.authenticate(password)) {
      return res.status(400).json({
        error: 'Email and password do not match',
      });
    }

    // generate a token and send to client
    /**  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });*/
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.cookie('token', token, { expire: new Date() + 9999 });
    const { _id, name, email, role, username } = user;

    return res.json({
      token,
      user: { _id, name, email, role, username },
    });
  });
};

export const logout = async (req, res) => {
  try {
    res.clearCookie('token');
    return res.json({ message: 'Signout success' });
  } catch (err) {
    console.log(err);
  }
};
