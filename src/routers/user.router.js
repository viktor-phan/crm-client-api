const express = require("express");
const { route } = require("./ticket.router");
const router = express.Router();
const {
  insertUser,
  getUserByEmail,
  getUserById,
  storeUserRefreshJWT,
} = require("../models/user/User.model");
const { hashPassword, comparePasswords } = require("../helpers/bcrypt.helper");
const {
  createAccessJWT,
  createRefreshJWT,
  verifyAccessJWT,
} = require("../helpers/jwt.helper");
const {
  userAuthorization,
} = require("../middlewares/authorization.middleware");
const { setPasswordResetPin } = require("../models/resetPin/resetPin.model");
const { getJWT, deleteJWT } = require("../helpers/redis.helper");

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
//Getting the pin to reset password
router.post("/reset-password", async (req, res) => {
  const { email } = req.body;

  const user = await getUserByEmail(email);
  if (!user) {
    const setPin = await setPasswordResetPin(email);
    return res.json(setPin);
  }
});
//Logout of a session
router.delete("/logout", userAuthorization, async (req, res) => {
  const { authorization } = req.headers;
  const decoded = await verifyAccessJWT(authorization);
  if (decoded.email) {
    const userId = await getJWT(authorization);
    if (!userId) {
      return res.json({ message: "Forbidden" });
    } else {
      deleteJWT(authorization);

      const result = storeUserRefreshJWT(userId, "");
      return res.json({ message: "Log out succesfully" });
    }
    res.json({ message: "Error, cannot log out" });
  }
});

module.exports = router;
