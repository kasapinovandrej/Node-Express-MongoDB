const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');

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
      set: (val) => Math.round(val * 10) / 10, // da zaokruzim na dve decimale
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
    startLocation: {
      // GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      adress: String,
      description: String,
    },
    locations: [
      {
        type: { type: String, default: 'Point', enum: ['Point'] },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }, // obavezno dodati za virtual's.... MONGOOSE: https://stackoverflow.com/questions/26909509/mongoose-toobject-virtuals-true
);

// INDEX
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
}); // da ne pamti prop u bazi bez potrebe, kalkulaciju odradi prilikom get-a

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});

// DOCUMENT MIDDLEWARE: runs only before .save() and .create()
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
// THIS IS EMBEDING! we want  by referencing
//   const guidesPromises = this.guides.map((id) => User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
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

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt',
  });

  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // count time passed in pre/post
  console.log(`Query took ${Date.now() - this.time} milliseconds!`);
  ////////////////////////////////

  next();
});

// AGGREGATION MIDDLEWARE
// tourSchema.pre('aggregate', function (next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   console.log(this.pipeline());
//   next();
// });

/////////////////////////////////

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
