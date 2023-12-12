const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

//middleware

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;

  const review = await service.read(reviewId);
  if (review.length === 0 || !reviewId) {
    return next({ status: 404, message: `Missing score or content in body.` });
  }
  res.locals.review = review[0];
  return next();
}

function updatedBody(res, req, next) {
  const { data: { score = null, content = null } = {} } = req.body;
  let update = {};
  if (!score && !content) {
    return next({ status: 400, message: `Missing score or content in body` });
  }
  if (score) {
    update.score = score;
  }
  if (content) {
    update.content = content;
  }
  res.locals.update = update;
}

//executive functions

async function read(req, res) {
  res.status(200).json({ data: res.locals.review });
}

async function put(req, res) {
  const { critic_id, review_id } = res.locals.review;
  const update = res.locals.update;
  await service.update(update, review_id);
  const updatedReview = await service.read(review_id);
  const critic = await service.getCritic(critic_id);
  res.status(200).json({ data: { ...updatedReview[0], critic: critic[0] } });
}

async function destroy(req, res) {
  const { review_id } = res.locals.review;
  await service.delete(review_id);
  res.sendStatus(204);
}

module.exports = {
  read: [asyncErrorBoundary(reviewExists), read],
  put: [asyncErrorBoundary(reviewExists), updatedBody, asyncErrorBoundary(put)],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
