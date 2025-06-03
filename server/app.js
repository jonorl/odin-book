// Config

require('dotenv').config();

// Express setup
const express = require("express");
const path = require('path')
const app = express();

// CORS setup
const cors = require("cors");
app.use(cors());
app.use(express.json());

// Router triggering
const mainRouter = require("./routes/mainRouter");
app.use("/", mainRouter);

// Launch and port confirmation
app.listen(process.env.PORT, () =>
  console.log(`Listeining on port ${process.env.PORT}`)
);