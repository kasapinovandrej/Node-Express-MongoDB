const Review = require('../models/reviewModel');
const {
  deleteOne,
  updateOne,
  createOne,
  getOne,
  getAll,
} = require('./handlerFactory');

exports.getAllReviews = getAll(Review);
exports.getReview = getOne(Review);
exports.createReview = createOne(Review);
exports.updateReview = updateOne(Review);
exports.deleteReview = deleteOne(Review);

exports.setTourUserIds = (req, res, next) => {
  // for nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
