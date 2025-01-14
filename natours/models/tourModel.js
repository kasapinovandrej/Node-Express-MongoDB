const mongoose = require('mongoose');
const slugify = require('slugify');

// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour mus have a name'],
      unique: true,
      trim: true,
      maxLength: [40, 'A tour name must have less or equal then 40 characters'],
      minLength: [10, 'A tour name must have more or equal then 10 characters'],
      // validate: [validator.isAlpha, 'Tour name must only contain characters'],
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour mus have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour mus have a group size'],
    },
    difficulty: {
      type: String,
      required: [true, 'A tour mus have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty can be easy, medium of difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: { type: Number, default: 0 },
    price: { type: Number, required: [true, 'A tour mus have a price'] },
    priceDiscount: {
      type: Number,
      validate: {
        // CUSTOM VALIDATOR
        validator: function (val) {
          return val < this.price;
        },
        message: `Discount price ({VALUE}) should be below regular price`,
      },
    },
    summary: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour mus have a description'],
    },
    imageCover: {
      type: String,
      required: [true, 'A tour mus have a image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false, // ako zelim da sakrijem output
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
  },
  { toJSON: { virtuals: true } }, // obavezno dodati za virtual's
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
}); // da ne pamti prop u bazi bez potrebe, kalkulaciju odradi prilikom get-a

// DOCUMENT MIDDLEWARE: runs only before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
// tourSchema.post('save', (doc, next) => {
//   console.log('>>>>', doc);
//   next();
// });

// QUERY MIDDLEWARE
// tourSchema.pre('find', function (next) { // ne radi za findOne treba dodati regular expression da bih obuhvatio sve find slucajeve /^find/
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  // count time passed in pre/post
  this.time = Date.now();
  ////////////////////////////////
  next();
});
tourSchema.post(/^find/, function (docs, next) {
  // count time passed in pre/post
  console.log(`Query took ${Date.now() - this.time} milliseconds!`);
  ////////////////////////////////

  next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  console.log(this.pipeline());
  next();
});

/////////////////////////////////

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
