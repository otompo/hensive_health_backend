import expressJwt from 'express-jwt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      username: user.username,
    },
    process.env.JWT_SECRET || 'somethingsecretone',
    {
      expiresIn: '1d',
    },
  );
};

export const requireSignin = expressJwt({
  // secret expiryDate
  getToken: (req, res) => req.cookies.token,
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
});

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      process.env.JWT_SECRET || 'somethingsecret',
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          next();
        }
      },
    );
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

// Admin Middleware
export const adminMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found....',
      });
    }

    if (!user.role.includes('Admin')) {
      return res.status(400).json({
        error: 'Admin resource. Access denied.',
      });
    }

    req.role = user;
    next();
  });
};

// Doctor Middleware
export const doctorMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found....',
      });
    }

    if (!user.role.includes('Doctor')) {
      return res.status(400).json({
        error: 'Doctor resource. Access denied.',
      });
    }

    req.role = user;
    next();
  });
};

// Nurse Middleware
export const nurseMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found....',
      });
    }

    if (!user.role.includes('Nurse')) {
      return res.status(400).json({
        error: 'Nurse resource. Access denied.',
      });
    }

    req.role = user;
    next();
  });
};

// Pharmacy Middleware
export const pharmacistMiddleware = (req, res, next) => {
  User.findById({ _id: req.user._id }).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: 'User not found....',
      });
    }

    if (!user.role.includes('Pharmacist')) {
      return res.status(400).json({
        error: 'Pharmacist resource. Access denied.',
      });
    }
    req.role = user;
    next();
  });
};
