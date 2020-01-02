const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/spotify', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const profile = require("./profile.js");
app.use("/api/profile", profile.routes);

app.listen(3002, () => console.log('Server listening on port 3002!'));