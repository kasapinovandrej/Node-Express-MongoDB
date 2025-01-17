const dotenv = require('dotenv');
const mongoose = require('mongoose');

process.on('uncaughtException', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config();
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD,
);

// mongoose
// .connect(DB, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useFindAndModify: false,
// })
//   .then((con) => console.log(con.connections));

mongoose.connect(DB).then((res) => console.log('DB connection successful!'));

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  // console.log(`App running on port ${PORT}`);
});

//For errors outside express: UNHANDLED REJECTIONS
process.on('unhandledRejection', (err) => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  server.close(() => {
    process.exit(1);
  });
});
