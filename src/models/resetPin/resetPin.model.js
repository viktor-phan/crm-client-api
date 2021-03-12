const { randomPinNumber } = require("../../utils/randomGenerator");
const { ResetPinSchema } = require("./resetPin.Schema");

const setPasswordResetPin = async (email) => {
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
        reject(error);
      });
  });
};
const getPinByEmailPin = (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPinSchema.findOne({ email, pin }, (error, data) => {
        if (error) {
          console.log(error);
          resolve(false);
        }

        resolve(data);
      });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};
const deletePin = (email, pin) => {
  return new Promise((resolve, reject) => {
    try {
      ResetPinSchema.findOneAndDelete({ email, pin }, (error, data) => {
        if (error) {
          console.log(error);
          resolve(false);
        }

        resolve(data);
      });
    } catch (error) {
      reject(error);
      console.log(error);
    }
  });
};
module.exports = {
  setPasswordResetPin,
  getPinByEmailPin,
  deletePin,
};
