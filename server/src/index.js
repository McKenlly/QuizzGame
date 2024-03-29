require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const http = require('http');
const ws = require('ws');
require("dotenv").config({ path: "/home/bokoch/quizzer/server/process.env" })

require('./models');

const simpleErrorHandler = require('./middleware/error-handler');
const httpWsUpgrade = require('./middleware/http-ws-upgrade');
const { initRoomCodes } = require('./rooms/code');
console.log("hello suka");
// const { EXPRESS_PORT, EXPRESS_SECRET, MONGODB_HOST, MONGODB_PORT, DB_NAME, MAX_QUESTIONS_PER_ROUND } = process.env;

const app = express();
const httpServer = http.createServer(app);
const wss = new ws.Server({ noServer: true });
const store = new MongoStore({
  mongooseConnection: mongoose.connection,
});
console.log(process.env.EXPRESS_SECRET);

const sessionParser = session({
  saveUninitialized: false, // Don't create session until something stored
  resave: false, // Don't save session if unmodified
  secret: process.env.EXPRESS_SECRET,
  store,
});

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.options(
  '*',
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use(sessionParser);

require('./routes')(app);

app.use(
  simpleErrorHandler({
    defaultStatusCode: 500,
    defaultMessage: 'Something went wrong...',
  })
);

httpServer.on('upgrade', httpWsUpgrade(sessionParser)(wss));
require('./wss.js')(wss);

const main = async () => {
  await mongoose.connect(`mongodb://${process.env.MONGODB_HOST}:${process.env.MONGODB_PORT}/${process.env.DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  await initRoomCodes();
  await new Promise(resolve => {
    httpServer.listen(process.env.EXPRESS_PORT, resolve);
  });
};

main()
  .then(() => {
    console.log(`Server is running on Port: ${process.env.EXPRESS_PORT}`);
  })
  .catch(reason => {
    console.error('ERROR:', reason);
  });
