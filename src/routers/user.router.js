const express = require("express");
const { route } = require("./ticket.router");
const router = express.Router();
const { insertUser } = require("../models/user/User.model");
const { hashPassword } = require("../helpers/bcrypt.helper");
router.get("/", (req, res, next) => {
  res.json({ message: "User router" });
  next();
});

router.post("/", async (req, res) => {
  try {
    const { name, company, address, phone, email, password } = req.body;
    console.log(name);
    //hash password
    const hashedPass = await hashPassword(password);
    const newUserObj = {
      name,
      company,
      address,
      phone,
      email,
      password: hashedPass,
    };

    const result = await insertUser(newUserObj);
     console.log(result);
     res.json(result);
  } catch (error) {
    res.json({ message: error.message, status: "error" });
  }
});

module.exports = router;
