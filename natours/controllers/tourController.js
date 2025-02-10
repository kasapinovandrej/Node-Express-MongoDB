// const fs = require('fs');
// const ApiFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

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
//   const features = new ApiFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const toursData = await features.query;
//   res.status(200).json({
//     status: 'success',
//     results: toursData.length,
//     data: { tours: toursData },
//   });
// } catch (err) {
//   res.status(404).json({
//     status: 'fail',
//     message: err,
//   });
// }
// };
// exports.getTour = async (req, res) => {
//   // const tour = toursData.find((el) => +el.id === +req.params.id);
//   // if (!tour)
//   //   return res.status(404).json({ status: 'fail', message: 'No tour found' });
//   // res.status(200).json({
//   //   status: 'success',
//   // data: { tour: tour },
//   // });
//   try {
//     const toursData = await Tour.findById(req.params.id);
//     res.status(200).json({
//       status: 'success',
//       data: { tour: toursData },
//     });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };
// exports.createTour = async (req, res) => {
//   // const newId = toursData[toursData.length - 1].id + 1;
//   // const newTour = { id: newId, ...req.body };
//   // toursData.push(newTour);
//   // fs.writeFile(
//   //   `${__dirname}/../dev-data/data/tours-simple.json`,
//   //   JSON.stringify(toursData),
//   //   (err) => {
//   //     if (err) {
//   //       console.log(err);
//   //     }
//   //     res.status(201).json({
//   //       status: 'success',
//   //       data: {
//   //         tour: newTour,
//   //       },
//   //     });
//   //   },
//   // );
//   try {
//     const newTour = await Tour.create(req.body);
//     res.status(201).json({
//       status: 'success',
//       data: {
//         tour: newTour,
//       },
//     });
//   } catch (err) {
//     res
//       .status(400)
//       .json({ status: 'fail', message: err.message || 'Invalid data sent!' });
//   }
// };
// exports.updateTour = async (req, res) => {
//   try {
//     const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });
//     res.status(200).json({ status: 'success', data: { tour: tour } });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };
// exports.deleteTour = async (req, res) => {
//   try {
//     await Tour.findByIdAndDelete(req.params.id);
//     res.status(204).json({ status: 'success', data: null });
//   } catch (err) {
//     res.status(404).json({
//       status: 'fail',
//       message: err,
//     });
//   }
// };
// BEFORE FACTORY FUNCTIONS
// exports.createTour = catchAsync(async (req, res, next) => {
//   const newTour = await Tour.create(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       tour: newTour,
//     },
//   });
// });
// exports.updateTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//     runValidators: true,
//   });
//   if (!tour) {
//     //handle errors
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(200).json({ status: 'success', data: { tour: tour } });
// });
// exports.deleteTour = catchAsync(async (req, res, next) => {
//   const tour = await Tour.findByIdAndDelete(req.params.id);
//   if (!tour) {
//     //handle errors
//     return next(new AppError('No tour found with that ID', 404));
//   }
//   res.status(204).json({ status: 'success', data: null });
// });
// exports.getTour = catchAsync(async (req, res, next) => {
//   const toursData = await Tour.findById(req.params.id).populate('reviews');

//   if (!toursData) {
//     //handle errors
//     return next(new AppError('No tour found with that ID', 404));
//   }

//   res.status(200).json({
//     status: 'success',
//     data: { tour: toursData },
//   });
// });
// exports.getAllTours = catchAsync(async (req, res, next) => {
//   const features = new ApiFeatures(Tour.find(), req.query)
//     .filter()
//     .sort()
//     .limitFields()
//     .paginate();
//   const toursData = await features.query;
//   res.status(200).json({
//     status: 'success',
//     results: toursData.length,
//     data: { tours: toursData },
//   });
// });
//////////////////////////////////////

exports.getAllTours = getAll(Tour);
exports.getTour = getOne(Tour, { path: 'reviews' });
exports.createTour = createOne(Tour);
exports.updateTour = updateOne(Tour);
exports.deleteTour = deleteOne(Tour);

exports.aliasTopTours = async (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage';
  req.query.fields = 'name, price, ratingsAverage, summary';
  next();
};

exports.getToursWithin = catchAsync(async (req, res, next) => {
  const { distance, latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');
  //delimo radius zemlje u mi ili km
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400,
      ),
    );
  }

  const tours = await Tour.find({
    startLocation: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    status: 'success',
    results: tours.length,
    data: { data: tours },
  });
});

exports.getDistances = catchAsync(async (req, res, next) => {
  const { latlng, unit } = req.params;
  const [lat, lng] = latlng.split(',');

  const multiplier = unit === 'mi' ? 0.000621371 : 0.001;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng',
        400,
      ),
    );
  }

  const distances = await Tour.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [+lng, +lat] },
        distanceField: 'distance',
        distanceMultiplier: multiplier,
      },
    },
    {
      $project: { distance: 1, name: 1 },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: { data: distances },
  });
});

//// AGGREGATE /////////////////////////////////////////////////////
exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});
/////////////////////////////////////////////////////////////////////////
