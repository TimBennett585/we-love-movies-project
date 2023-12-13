const knex = require("../db/connection");

function list() {
  return knex("movies").select("*");
}

function listShowing() {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .select("m.*")
    .where({ "mt.is_showing": true })
    .distinct("mt.movie_id")
    .distinct("m.movie_id");
}

function read(movieId) {
  return knex("movies").where({ movie_id: movieId });
}

function getCritics(criticId) {
  return knex("critics").where({ critic_id: criticId });
}

function listReviews(movieId) {
  return knex("movies as m")
    .join("reviews as r", "m.movie_id", "r.movie_id")
    .where({ "m.movie_id": movieId });
}

function listTheaters(movieId) {
  return knex("movies as m")
    .join("movies_theaters as mt", "m.movie_id", "mt.movie_id")
    .join("theaters as t", "t.theater_id", "mt.theater_id")
    .select("t.*", "m.movie_id")
    .where({ "m.movie_id": movieId });
}

module.exports = {
  list,
  listShowing,
  read,
  getCritics,
  listReviews,
  listTheaters,
};
