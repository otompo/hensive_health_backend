import User from '../models/userModel';
import sharp from 'sharp';
import shortId from 'shortid';
import multer from 'multer';

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images.', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

export const uploadImage = upload.single('image');

export const resizeImage = async (req, res, next) => {
  if (!req.file) return next();
  let uniqueID = shortId.generate();
  req.file.filename = `user-${uniqueID}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`images/users/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const currentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password').exec();

    // console.log("CURRENT_USER", user);
    return res.json(user);
    // return res.json({ ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send({ error: 'Please login is required' });
  }
};

export const makeUserAdmin = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send('User not found');
    const roleUpdated = await User.findOneAndUpdate(
      { username },
      {
        $addToSet: { role: 'Admin' },
      },
      { new: true },
    ).exec();
    res.send({ message: `${user.name}  is now an Admin ` });
    // console.log(roleUpdated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const makeUserNurse = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send('User not found');
    const roleUpdated = await User.findOneAndUpdate(
      { username },
      {
        $addToSet: { role: 'Nurse' },
      },
      { new: true },
    ).exec();
    res.send({ message: `${user.name}  is now an Nurse ` });
    // console.log(roleUpdated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const makeUserPharmacist = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send('User not found');
    const roleUpdated = await User.findOneAndUpdate(
      { username },
      {
        $addToSet: { role: 'Pharmacist' },
      },
      { new: true },
    ).exec();
    res.send({ message: `${user.name}  is now an Pharmacist ` });
    // console.log(roleUpdated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const makeUserDoctor = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send('User not found');
    const roleUpdated = await User.findOneAndUpdate(
      { username },
      {
        $addToSet: { role: 'Doctor' },
      },
      { new: true },
    ).exec();
    res.send({ message: `${user.name}  is now an Doctor ` });
    // console.log(roleUpdated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const removeAsAdmin = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send('User not found');
    const roleUpdated = await User.findOneAndUpdate(
      { username },
      {
        $pull: { role: 'Admin' },
      },
      { new: true },
    ).exec();
    res.send({ message: `${user.name}  is remove as an Admin ` });
    // console.log(roleUpdated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const removeAsDoctor = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send('User not found');
    const roleUpdated = await User.findOneAndUpdate(
      { username },
      {
        $pull: { role: 'Doctor' },
      },
      { new: true },
    ).exec();
    res.send({ message: `${user.name}  is remove as an Doctor` });
    // console.log(roleUpdated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const removeAsNurse = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send('User not found');
    const roleUpdated = await User.findOneAndUpdate(
      { username },
      {
        $pull: { role: 'Nurse' },
      },
      { new: true },
    ).exec();
    res.send({ message: `${user.name}  is remove as an Nurse ` });
    // console.log(roleUpdated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const removeAsPharmacist = async (req, res) => {
  try {
    const username = req.params.username.toLowerCase();
    const user = await User.findOne({ username }).exec();
    if (!user) return res.status(400).send('User not found');
    const roleUpdated = await User.findOneAndUpdate(
      { username },
      {
        $pull: { role: 'Pharmacist' },
      },
      { new: true },
    ).exec();
    res.send({ message: `${user.name}  is remove as an Pharmacist` });
    // console.log(roleUpdated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: 'Admin' })
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
    res.json({ total: users.length, users });
    if (!users) return res.status(400).send({ error: 'Users not found' });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const getAllNurses = async (req, res) => {
  try {
    const users = await User.find({ role: 'Nurse' })
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
    res.json({ total: users.length, users });
    if (!users) return res.status(400).send({ error: 'Nurses not found' });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const getAllDoctors = async (req, res) => {
  try {
    const users = await User.find({ role: 'Doctors' })
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
    res.json({ total: users.length, users });
    if (!users) return res.status(400).send({ error: 'Doctors not found' });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const getAllPharmacist = async (req, res) => {
  try {
    const users = await User.find({ role: 'Pharmacist' })
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
    res.json({ total: users.length, users });
    if (!users) return res.status(400).send({ error: 'Pharmacist not found' });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const getAllStaff = async (req, res) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .exec();
    res.json(users);
    if (!users) return res.status(400).send({ error: 'Users not found' });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const getUserPublicProfile = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await User.findOne({ username })
      .select('-password -role -username -hashed_password -salt')
      .exec();
    if (!user) return res.status(400).send({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

export const getUserProfile = async (req, res) => {
  try {
    // const userId = req.params;
    const user = await User.findById(req.params.userId).exec();
    if (!user) return res.status(400).send({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

// export const userUpdateProfile = async (req, res) => {
//   try {
//     let { name, email, username } = req.body;

//     let userExist = await User.findOne({ email }).exec();
//     if (userExist) return res.status(400).send({ error: 'Email is taken ' });

//     const user = await User.findOne({ username: req.params.username });
//     if (!user) return res.status(400).send({ error: 'User not found' });
//     // hash password

//     if (user) {
//       user.name = name || user.name;
//       user.email = email || user.email;
//       user.username = username || user.username;
//     }

//     // console.log(user);
//     const updatedUser = await user.save();
//     res.send({
//       _id: updatedUser._id,
//       name: updatedUser.name,
//       email: updatedUser.email,
//       username: updatedUser.username,
//     });
//   } catch (err) {
//     console.log(err);
//     return res.status(400).send(err.message);
//   }
// };

export const userUpdatePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res
        .status(404)
        .send('password is required and should be min 6 characters long');
    }

    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(400).send('User not found');
    // hash password

    let hashedPassword = await hashPassword(newPassword);
    const userupdated = await User.findOneAndUpdate(
      {
        user,
      },
      {
        password: hashedPassword,
      },
    ).exec();
    // if (!userupdated) return res.status(400).send({error:'Can not update user'});
    res.send({ Ok: true });
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};

//   update User
export const userUpdate = async (req, res) => {
  try {
    // 1) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'username');
    if (req.file) filteredBody.image = req.file.filename;

    const { username } = req.params;
    const user = await User.findOneAndUpdate({ username }, filteredBody, {
      new: true,
    }).exec();
    if (!user) return res.status(400).send('user not found');
    res.send(user);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Couldn't update please try again");
  }
};

export const userstats = async (req, res) => {
  const date = new Date();
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));

  try {
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: '$createdAt' },
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json(err);
  }
};
