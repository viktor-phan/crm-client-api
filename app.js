const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

app.use(helmet());

app.use(cors());

app.use(morgan("tiny"));

app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());


const userRouter = require("./src/routers/user.router")

const port = process.env.PORT || 3001;

app.use("/v1/user", userRouter);

app.use("/", (req, res, next) => {
  res.json({ message: "Hi there" });
});

app.listen(port, () => {
  console.log("API is ready at port " + port);
});
