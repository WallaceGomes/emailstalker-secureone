require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const error = require('./middleware/error');
const routes = require('./routes');
const { emailStalker } = require('./helpers/emailHelper');

const MINUTESTOCHECK = 0.6;

const app = express();

app.use(bodyParser.json({ limit: '25MB' }));

app.use(cors());

app.use(routes);

//error middleware
app.use(error);

setInterval(() => emailStalker(), MINUTESTOCHECK * 60 * 1000);

module.exports = app;
