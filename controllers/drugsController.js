import multer from 'multer';
import shortId from 'shortid';
import Drug from '../models/drugsModel';
import sharp from 'sharp';

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
  let drugID = shortId.generate();
  req.file.filename = `drug-${drugID}-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`images/drugs/${req.file.filename}`);

  next();
};

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

export const createDrug = async (req, res) => {
  try {
    let drugID = shortId.generate();
    const { name, description, price, expireDate, quantity } = req.body;
    if (!name || !description || !expireDate || !price || !quantity)
      return res.status(400).send('all fileds are required');
    const drug = await new Drug({
      drugID,
      pharmacistInfo: req.user._id,
      name,
      description,
      price,
      quantity,
      expireDate: new Date(expireDate),
    }).save();
    res.send(drug);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Couldn't create please try again");
  }
};

//   update drugs
export const updateDrug = async (req, res) => {
  try {
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(
      req.body,
      'name',
      'drugID',
      'description',
      'price',
      'quantity',
      'expireDate',
    );

    if (req.file) filteredBody.image = req.file.filename;
    const { drugID } = req.params;
    
    const drug = await Drug.findOneAndUpdate({ drugID }, filteredBody, {
      new: true,
    }).exec();
    if (!drug) return res.status(400).send('Drug was found');
    res.send(drug);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Couldn't update please try again");
  }
};

export const getAllDrugs = async (req, res) => {
  try {
    const drugs = await Drug.find({}).sort({ createdAt: -1 }).exec();
    if (!drugs) return res.status(400).send("Couldn't fine drugs");
    res.send(drugs);
  } catch (err) {
    console.log(err);
    return res.status(400).send('filed to fetch drugs');
  }
};

export const getSingleDrug = async (req, res) => {
  try {
    const { drugID } = req.params;
    const drug = await Drug.findOne({ drugID }).exec();
    if (!drug) return res.status(400).send("Couldn't fine drug");
    res.send(drug);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Couldn't update please try again");
  }
};

