const express = require("express");
const session = require("express-session");
const dotenv = require("dotenv");

dotenv.config();
require("./db");

const app = express();

app.use(express.json())

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    name: "secret inv session",
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 30,
      httpOnly: true,
      secure: false,
      sameSite: "strict"
    }
  })
);

// Routes
// dashboard route
app.use(require("./routes/homeRoute"));

// CurrencyExchange Routes
app.use(require('./routes/currencyExRoutes'));

// User Routes
app.use(require("./routes/userRoutes"));
app.use(require("./routes/userEmailRoutes"));


module.exports = app;
