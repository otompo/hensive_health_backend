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
    const { name, description, price, expireDate, stock } = req.body;
    if (!name || !description || !expireDate || !price || !stock)
      return res.status(400).send('all fileds are required');
    const drug = await new Drug({
      drugID,
      pharmacistInfo: req.user._id,
      name,
      description,
      price,
      stock,
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
      'stock',
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
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    const count = await Drug.countDocuments({ ...keyword });
    const drugs = await Drug.find({ ...keyword })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .exec();
    if (!drugs) return res.status(400).send("Couldn't fine drugs");
    res.send({ page, pages: Math.ceil(count / pageSize), drugs });
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

export const getAllDrugsOutOfStock = async (req, res, next) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    const count = await Drug.countDocuments({ ...keyword });
    const drugs = await Drug.find({
      $expr: { $lte: [{ $toDouble: '$stock' }, 1.0] },
      ...keyword,
    })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .exec();

    if (!drugs) return res.status(404).send('Drugs not found');
    res.send({ page, pages: Math.ceil(count / pageSize), drugs });
  } catch (err) {
    console.log(err);
  }
};

export const aboutToOutofStock = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    const drugsQuery = Drug.find({
      $and: [
        { $expr: { $lte: [{ $toDouble: '$stock' }, 15.0] } },
        { $expr: { $gte: [{ $toDouble: '$stock' }, 1.0] } },
      ],
    });
    if (pageSize && currentPage) {
      drugsQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    drugsQuery.then((drugs) => {
      res.status(200).json({
        total: drugs.length,
        data: drugs,
      });
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAllExpiredDrugs = async (req, res, next) => {
  try {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: 'i',
          },
        }
      : {};
    const count = await Drug.countDocuments({ ...keyword });

    const drugs = await Drug.find({
      expireDate: { $lte: new Date() },
      ...keyword,
    })
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1))
      .exec();
    if (!drugs) return res.status(404).send('Drugs not found');
    res.send({
      total: drugs.length,
      page,
      pages: Math.ceil(count / pageSize),
      drugs,
    });
  } catch (err) {
    console.log(err);
  }
};

export const getAllAboutToExpire = async (req, res, next) => {
  try {
    const pageSize = +req.query.pagesize;
    const currentPage = +req.query.page;
    var date = new Date();
    var date10 = new Date(date.getTime());
    date10.setDate(date10.getDate() + 10);
    const drugQuery = await Drug.find({
      expireDate: { $lte: new Date(date10), $gte: new Date() },
    });

    if (pageSize && currentPage) {
      drugQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
    }
    res.send({ total: drugQuery.length, drugQuery });
  } catch (err) {
    console.log(err);
  }
};
