const express = require("express");
const { route } = require("./ticket.router");
const router = express.Router();
const {
  insertUser,
  getUserByEmail,
  getUserById,
} = require("../models/user/User.model");
const { hashPassword, comparePasswords } = require("../helpers/bcrypt.helper");
const { createAccessJWT, createRefreshJWT } = require("../helpers/jwt.helper");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const { setPasswordResetPin } = require("../models/resetPin/resetPin.model");
// router.get("*", (req, res, next) => {
//   res.json({ message: "User router" });
//   // next();
// });

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

// Get user profile
router.get("/", userAuthorization, async (req, res) => {
  const _id = req.userId;
  const userProf = await getUserById(_id);
  //console.log(res);
  res.status(200).json({ user: userProf });
});
//Create new user route

//User sign in route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({ message: "invalid form submission" });
  }
  // Get user with email from DB
  const user = await getUserByEmail(email);

  //Hash password and compare with in DB
  const passFromDB = user && user._id ? user.password : null;
  if (!passFromDB) {
    return res.json({ status: "Invalid email or password" });
  } else {
    const result = await comparePasswords(password, passFromDB);
    console.log(result);
    if (!result) {
      return res.json({ status: "Invalid email or password" });
    } else {
      const accessJWT = await createAccessJWT(user.email, `${user._id}`);
      const refreshJWT = await createRefreshJWT(user.email, `${user._id}`);
      console.log(accessJWT);
      console.log(refreshJWT);
      console.log(user);
      return res.json({
        message: "Log in successfully",
        jwt: accessJWT,
        refJWT: refreshJWT,
      });
    }
  }
});
router.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    const setPin = await setPasswordResetPin(email);
    return res.json(setPin);
    //res.json({ status: "error", message: "Wait for pin" });
  }
  
});

module.exports = router;
