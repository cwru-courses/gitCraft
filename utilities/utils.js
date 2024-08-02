const {
  emailRegex,
  postStatus,
  requiredAttributes,
  optionalAttributes,
} = require("./constants");

function validate(record) {
  return new Promise((resolve, reject) => {
    try {
      let {
        name,
        email,
        password,
        action,
        id,
        otp,
        title,
        description,
        image,
        status,
      } = record;
      let resolvable = {};
      let actionAttributes = requiredAttributes[action];

      actionAttributes.forEach((attr) => {
        if (
          (!optionalAttributes.includes(action) || attr === "id") &&
          record[attr] === undefined
        ) {
          reject(`${attr} attribute mission`);
        }
        if (attr === "id" && !id) {
          reject("id attribute missing");
        }
        if (attr === "name" && name.length < 3) {
          reject(`name must be greater than or equal to 3 characters`);
        }
        if (attr === "password" && password.length < 8) {
          reject(`password must be greater than or equal to 8 characters`);
        }
        if (attr === "title" && title.length < 3) {
          reject(`title must be greater than or equal to 3 characters`);
        }
        if (attr === "description" && description.length < 25) {
          reject(`description must be greater than or equal to 25 characters`);
        }
        if (attr === "email" && !emailRegex.test(email)) {
          reject(`${email} is not a valid email`);
        }
        if (attr === "otp" && otp.length !== 6) {
          reject("please enter a valid otp");
        }
        if (
          (!optionalAttributes.includes(action) || record[attr]) &&
          attr === "status" &&
          !postStatus.includes(status)
        ) {
          reject("status has to be only private or public");
        }

        resolvable[attr] = record[attr];
      });

      resolve(resolvable);
    } catch (error) {
      reject(`error occured while validating the record, ${error.message}`);
    }
  });
}

function onlyJson(object) {
  return JSON.parse(JSON.stringify(object));
}

function filterOut({ object, from, type }) {
  let data = {};
  let objectItr = onlyJson(object);
  for (let [key, value] of Object.entries(objectItr)) {
    if (type === "value") {
      if (value !== from) data[key] = value;
    } else if (type === "key") {
      if (key !== from) data[key] = value;
    }
  }
  return data;
}

function generateOTP(isPassword = false) {
  let digits =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*()_+";
  let OTP = "";
  let len = digits.length;
  let run = isPassword ? 12 : 6;
  for (let i = 0; i < run; i++) {
    OTP += digits[Math.floor(Math.random() * len)];
  }
  return OTP;
}

function minDiffFromNow(then) {
  let now = new Date();
  var diff = (now.getTime() - then.getTime()) / 1000;
  diff /= 60;
  return Math.abs(Math.round(diff));
}

module.exports = {
  validate,
  minDiffFromNow,
  generateOTP,
  onlyJson,
  filterOut,
};
