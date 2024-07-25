const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const path = require("path");

const { minDiffFromNow } = require("../utilities/utils");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const user = {
  uid: ObjectId,
  name: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 3;
      },
      message: (props) => `name must be greater than or equal to 3 characters`,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return emailRegex.test(v);
      },
      message: (props) => `${props.value} is not a valid email`,
    },
  },
  password: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: userStatus,
    default: userStatus[1],
  },
};

const userSchema = new Schema(user, { versionKey: false });

const userModel = mongoose.model("user", userSchema);

async function hashPassword({ password }) {
  const salt = await bcrypt.genSalt(8);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
}

async function passwordIsMatched({ hashedPassword, password }) {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}

async function createUser({ name, password, email }) {
  let hashedPassword = await hashPassword({ password });
  return new Promise((resolve, reject) => {
    userModel
      .create({
        name,
        email,
        password: hashedPassword,
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}


function userLogin({ email, password }) {
  return new Promise(function (resolve, reject) {
    getUser({ email })
      .then((res) => {
        if (res.length > 0) return res[0];
        reject({ message: `${email} is not found` });
      })
      .then((res) => {
        if (res.status === userStatus[0]) {
          passwordIsMatched({
            hashedPassword: res.password,
            password,
          }).then((isMatched) => {
            if (isMatched) {
              resolve(res);
            } else {
              reject({ message: `${res.email} and password doesn't match` });
            }
          });
        } else {
          reject({ message: `${res.name} is not active` });
        }
      })
      .catch((err) => reject(err));
  });
}

function fsRead(cb) {
  fs.readFile(otpJsonPath, "utf-8", (err, res) => {
    if (err) console.error(err);
    cb(res?.length > 0 ? JSON.parse(res) : {});
  });
}


function verifyUser({ email, otp }) {
  return new Promise(function (resolve, reject) {
    getUser({ email })
      .then((res) => {
        if (res.length > 0) return res[0];
        reject({ message: `${email} is not found` });
      })
      .then((res) => {
        if (res.status === userStatus[1]) {
          verifyOTP(email, otp, ({ status, message }) => {
            if (status === 200) {
              updateUser(res._id, { status: userStatus[0] }).then((data) =>
                resolve({ message: `${email}, was verified successfully` })
              );
            } else if (status === 403) {
              deleteUser({ id: res._id });
              reject({ message: `${message}, try signing up again` });
            }
          });
        } else {
          reject({ message: `${res.name} is already active` });
        }
      })
      .catch((err) => reject(err));
  });
}

module.exports = {
  createUser,
  verifyUser,
  userLogin,
};
