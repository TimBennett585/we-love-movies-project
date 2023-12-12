const service = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");

//middleware

const VALID_PROPERTIES = ["score", "content"];

function hasOnlyValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }
  next();
}

const hasRequiredProperties = hasProperties("score", "title");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;

  const review = await service.read(reviewId);
  if (review) {
    res.locals.review = review[0];
    return next();
  }
  return next({ status: 400, message: `Missing score or content in body.` });
}

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
  put: [
    asyncErrorBoundary(reviewExists),
    hasOnlyValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(put),
  ],
  delete: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
