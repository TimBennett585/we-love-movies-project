if (process.env.USER) require("dotenv").config();

const express = require("express");
const app = express();

const moviesRouter = require("./movies/movies.router");
const reviewsRouter = require("./reviews/reviews.router");
const theatersRouter = require("./theaters/theaters.router");
const notFound = require("./errors/notFound");
const errorHandler = require("./errors/errorHandler");

const cors = require("cors");

app.use(cors());
app.use(express.json());

app.use("/", (err, req, res, next) => {
  res.json({
    message: `Welcome! You can access the data using these routes: /movies, /reviews, /theaters, /reviews/:reviewId, /movies/:movideId, /movies/:movieId/theaters, and /movies/:movieId/reviews.`,
  });
});

app.use("/movies", moviesRouter);
app.use("/reviews", reviewsRouter);
app.use("/theaters", theatersRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
