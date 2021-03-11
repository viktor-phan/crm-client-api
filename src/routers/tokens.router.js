const express = require("express");
const router = express.Router();

const { verifyRefreshJWT, createAccessJWT } = require("../helpers/jwt.helper");
const { getUserByEmail } = require("../models/user/User.model");

router.get("/", async (req, res, next) => {
  //Get JWT in header
  const { authorization } = req.headers;
  //Check Authorization
  const decoded = await verifyRefreshJWT(authorization);
  if (decoded.email) {
    //Get ID from login email
    const userProf = await getUserByEmail(decoded.email);
    //If there is ID
    if (userProf._id) {
      //Get Token exp date
      let tokenExp = userProf.refreshJWT.addedAt;
      //Get token from DB
      const dBrefreshToken = userProf.refreshJWT.token;
      //Token new exp date
      tokenExp = tokenExp.setDate(
        tokenExp.getDate() + +process.env.JWT_REFRESH_SECRET_EXP_DAY
      );
      //JS get Time today
      const today = new Date();
      //When not authorize(dont have token or token exp)
      if (dBrefreshToken !== authorization && tokenExp < today) {
        return res.status(403).json({ message: "Forbidden" });
      }
      //When hauthorize, get new accesssJWT
      const accessJWT = await createAccessJWT(
        decoded.email,
        userProf._id.toString()
      );

      return res.json({ status: "success", accessJWT });
    }
  }
  //No token to access
  res.status(403).json({ message: "Forbidden" });
});

module.exports = router;
