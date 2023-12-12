const service = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
  const theaters = await service.list();
  const theatersShowing = [];
  for (let i = 0; i < theaters.length; i++) {
    const theater = theaters[i];
    const { theater_id } = theater;
    const movies = await service.getMovies(theater_id);
    const showing = { ...theater, movies: movies };
    theatersShowing.push(showing);
  }
  res.status(200).json({ data: theatersShowing });
}

module.exports = {
  list: asyncErrorBoundary(list),
};
