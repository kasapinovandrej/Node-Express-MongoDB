// const fs = require('fs');
const Tour = require('../models/tourModel');
const ApiFeatures = require('../utils/apiFeatures');

// const toursData = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8'),
// );

// exports.checkId = (req, res, next, val) => {
//   const id = +req.params.id;
//   if (id > toursData.length)
//     return res.status(404).json({ status: 'fail', message: 'No tour found' });
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.name || !req.body.price) {
//     return res
//       .status(400)
//       .json({ status: 'fail', message: 'Missing name or price' });
//   }
//   next();
// };

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name, price, ratingsAverage, summary';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // BUILD QUERY
    // 1a) FILTERING
    // const queryObj = { ...req.query };
    // const excludedFields = ['page', 'sort', 'limit', 'fields'];
    // excludedFields.forEach((el) => delete queryObj[el]);
    // // 1b) ADVANCED FILTERING
    // let queryString = JSON.stringify(queryObj);
    // queryString = JSON.parse(
    //   queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`),
    // );
    // let query = Tour.find(queryString);
    // 2) SORTING
    // if (req.query.sort) {
    //   const sortBy = req.query.sort.split(',').join(' ');
    //   query = query.sort(sortBy);
    // } else {
    //   // default one
    //   // query = query.sort('-createdAt'); sjebe paginaciju (svi dodati u isto vreme)
    //   query = query.sort('name');
    // }
    // 3) FIELD LIMITING
    // 127.0.0.1:8000/api/v1/tours?fields=-name,duration,price stavim minus ako zelim da iskljucim samo ta polja
    // if (req.query.fields) {
    //   const fields = req.query.fields.split(',').join(' ');
    //   query = query.select(fields);
    // } else {
    //   query = query.select('-__v');
    // }
    // 4) PAGINATION
    // const page = +req.query.page || 1;
    // const limit = +req.query.limit || 100;
    // const skipValue = (page - 1) * limit;
    // query = query.skip(skipValue).limit(limit);
    // if (req.query.page) {
    //   const numTours = await Tour.countDocuments();
    //   if (skipValue >= numTours) throw new Error('This page does not exist!');
    // }

    // EXECUTE QUERY
    const features = new ApiFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const toursData = await features.query;

    res.status(200).json({
      status: 'success',
      results: toursData.length,
      data: { tours: toursData },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  // const tour = toursData.find((el) => +el.id === +req.params.id);
  // if (!tour)
  //   return res.status(404).json({ status: 'fail', message: 'No tour found' });
  // res.status(200).json({
  //   status: 'success',
  // data: { tour: tour },
  // });
  try {
    const toursData = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'success',
      data: { tour: toursData },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  // const newId = toursData[toursData.length - 1].id + 1;
  // const newTour = { id: newId, ...req.body };
  // toursData.push(newTour);
  // fs.writeFile(
  //   `${__dirname}/../dev-data/data/tours-simple.json`,
  //   JSON.stringify(toursData),
  //   (err) => {
  //     if (err) {
  //       console.log(err);
  //     }
  //     res.status(201).json({
  //       status: 'success',
  //       data: {
  //         tour: newTour,
  //       },
  //     });
  //   },
  // );
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res
      .status(400)
      .json({ status: 'fail', message: err.message || 'Invalid data sent!' });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ status: 'success', data: { tour: tour } });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({ status: 'success', data: null });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

//// AGGREGATE /////////////////////////////////////////////////////
exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      { $match: { ratingsAverage: { $gte: 4.5 } } },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numOfTours: { $sum: 1 },
          numOfRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' },
        },
      },
      { $sort: { avgPrice: 1 } },
      // { $match: { _id: { $ne: 'EASY' } } },
    ]); // MOCNA STVAR ZA STATISTIKU

    res.status(200).json({ status: 'success', data: { stats: stats } });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = +req.params.year;
    const plan = await Tour.aggregate([
      { $unwind: '$startDates' },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' },
        },
      },
      { $addFields: { month: '$_id' } },
      { $project: { _id: 0 } },
      { $sort: { numTourStarts: -1 } },
      // { $limit: 6 },
    ]);
    res.status(200).json({ status: 'success', data: { plan: plan } });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};
/////////////////////////////////////////////////////////////////////////
