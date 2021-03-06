require("dotenv").config();
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const mongoose = require("mongoose");

app.use(helmet());
app.use(cors());
app.use(morgan("tiny"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Database setup
mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
  useCreateIndex: true,
});
if (process.env.NODE_ENV !== "production") {
  const mDb = mongoose.connection;
  mDb.on("open", () => {
    console.log("MDB is connected");
  });
  mDb.on("error", (err) => {
    console.log(err);
  });
}

const port = process.env.PORT || 3001;

const userRouter = require("./src/routers/user.router");
const ticketRouter = require("./src/routers/ticket.router");
const handleError = require("./src/utils/errorHandler");

//Load routers
app.use("/v1/user", userRouter);
app.use("/v1/ticket", ticketRouter);

//Routers
app.use((req, res, next) => {
  const error = new Error("Resources not found");
  console.log(error.status);
  next(error);
});
app.use((error, req, res, next) => {
  handleError(error, res);
});

//Listener
app.listen(port, () => {
  console.log("API is ready at port " + port);
});
