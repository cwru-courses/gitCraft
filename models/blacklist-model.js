const mongoose = require("mongoose");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const blacklist = {
  bid: ObjectId,
  uid: { type: Schema.Types.ObjectId, ref: "user" },
  token: {
    type: String,
    required: true,
  },
  on: {
    type: Date,
    default: Date.now(),
  },
};

const blacklistSchema = new Schema(blacklist, { versionKey: false });

const blacklistModel = mongoose.model("blacklist", blacklistSchema);

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
