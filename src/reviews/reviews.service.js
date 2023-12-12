const knex = require("../db/connection");

function read(reviewId) {
  return knex("reviews").where({ review_id: reviewId });
}

function update(updatedReview, reviewId) {
  return knex("reviews")
    .select("*")
    .where({ review_id: reviewId })
    .update({ ...updatedReview, updated_at: db.fn.now() })
    .then((updatedRecords) => updatedRecords[0]);
}

function destroy(reviewId) {
  return knex("reviews").where({ review_id: reviewId }).del();
}

function getCritic(criticId) {
  return knex("critics").where({ critic_id: criticId }).select("*");
}

module.exports = {
  update,
  delete: destroy,
  getCritic,
  read,
};
