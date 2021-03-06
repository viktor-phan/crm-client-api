const { UserSchema } = require("./User.schema");

const insertUser = (userObj) => {
  return new Promise((resolve, reject) => {
    UserSchema(userObj)
      .save()
      .then((data) => {
        resolve(data);
        console.log("user created");
      })
      .catch((err) => reject(err));
  });
};

module.exports = { insertUser };
