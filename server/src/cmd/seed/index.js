require('dotenv').config();
const mongoose = require('mongoose');

require('../../models');
console.log("fdffdf")
require("dotenv").config({ path: "/home/bokoch/quizzer/server/process.env" })

const { MONGODB_HOST, MONGODB_PORT, DB_NAME } = process.env;
console.log(MONGODB_HOST)

const seedQuestion = require('./question');

mongoose
  .connect(`mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    return Promise.all([seedQuestion()]);
  })
  .catch(error => {
    console.error(error);
  })
  .then(() => {
    return mongoose.connection.close();
  });
