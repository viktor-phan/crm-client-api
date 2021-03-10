const { randomPinNumber } = require("../../utils/randomGenerator");
const { ResetPinSchema } = require("./resetPin.Schema");

const  setPasswordResetPin = async (email) => {
  const randPin = await randomPinNumber(6);
  const resetObj = {
    email,
    pin: randPin,
  };
  return new Promise((resolve, reject) => {
    ResetPinSchema(resetObj)
      .save()
      .then((data) => resolve(data))
      .catch((error) => {
        console.log(error);
        reject(error)});
  });
};
module.exports = {
  setPasswordResetPin
};
