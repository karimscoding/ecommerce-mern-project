const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const createError = require("http-errors");
const xssClean = require("xss-clean");
const rateLimit = require("express-rate-limit");

const app = express();

const rateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5,
  message: "Too many request from this IP, please try again later",
});

// Middlewares
app.use(rateLimiter);
app.use(xssClean());
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const isLoggedIn = (req, res, next) => {
  const login = true;

  if (login) {
    req.body.id = 101;
    next();
  } else {
    return res.status(401).json({ message: "unauthorized user" });
  }
  console.log("middleware is working");
};

app.get("/test", (req, res) => {
  res.status(200).send({
    message: "welcome to the server",
  });
});

app.get("/api/users", (req, res) => {
  console.log(req.body.id);
  res.status(200).send({
    message: "user profile is returned",
  });
});

// client error handling
app.use((req, res, next) => {
  next(createError(404, "route not found"));
});

// server error handling -> all the error
app.use((err, req, res, next) => {
  return res.status(err.status || 500).json({
    success: false,
    message: err.message,
  });
});

module.exports = app;
