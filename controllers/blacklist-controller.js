const { blacklistModel } = require("../models/blacklist-model");

function logout({ token, uid }) {
  return new Promise((resolve, reject) => {
    blacklistModel
      .create({
        token,
        uid,
      })
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

function findBlacklist({ token }) {
  return new Promise((resolve, reject) => {
    resolve(blacklistModel.find({ token }).exec());
  });
}

module.exports = { logout, findBlacklist };
