const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { deleteOne, updateOne, getOne, getAll } = require('./handlerFactory');

const filterObj = (obj, ...rest) => {
  const newObject = {};
  Object.keys(obj).forEach((el) => {
    if (rest.includes(el)) newObject[el] = obj[el];
  });
  return newObject;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POST password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /update-password.',
        400,
      ),
    );
  }
  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ status: 'success', data: { user: updatedUser } });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  // 1) find user
  await User.findByIdAndUpdate(req.user.id, { active: false });
  // 2) change active field to false

  res.status(204).json({ status: 'success', data: null });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined! Please use /signup instead',
  });
};

exports.getAllUsers = getAll(User);
exports.getUser = getOne(User);
exports.updateUser = updateOne(User);
exports.deleteUser = deleteOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};
