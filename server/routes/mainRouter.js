// Express set-up
const { Router } = require("express");
const mainRouter = Router();

// Import database queries
const db = require("../db/queries");

// GET routes

mainRouter.get("/api/v1/test/", async (req, res) => {
  res.json({ message: "working" });
});

module.exports = mainRouter;
