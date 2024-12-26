const fs = require('fs');

const toursData = JSON.parse(
  fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`, 'utf-8')
);

exports.checkId = (req, res, next, val) => {
  const id = +req.params.id;
  if (id > toursData.length)
    return res.status(404).json({ status: 'fail', message: 'No tour found' });
  next();
};

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res
      .status(400)
      .json({ status: 'fail', message: 'Missing name or price' });
  }
  next();
};

exports.getAllTours = (req, res) => {
  res.status(200).json({
    status: 'success',
    aaa: req.requestTime,
    results: toursData.length,
    data: { tours: toursData },
  });
};

exports.getTour = (req, res) => {
  const tour = toursData.find((el) => +el.id === +req.params.id);
  // if (!tour)
  //   return res.status(404).json({ status: 'fail', message: 'No tour found' });
  res.status(200).json({
    status: 'success',
    data: { tour: tour },
  });
};

exports.createTour = (req, res) => {
  const newId = toursData[toursData.length - 1].id + 1;
  const newTour = { id: newId, ...req.body };
  toursData.push(newTour);
  fs.writeFile(
    `${__dirname}/../dev-data/data/tours-simple.json`,
    JSON.stringify(toursData),
    (err) => {
      if (err) {
        console.log(err);
      }
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

exports.updateTour = (req, res) => {
  res
    .status(200)
    .json({ status: 'success', data: { tour: '<UPDATE TOUR HERE>' } });
};

exports.deleteTour = (req, res) => {
  res.status(204).json({ status: 'success', data: null });
};
