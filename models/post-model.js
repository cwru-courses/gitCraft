const mongoose = require("mongoose");

const { postStatus } = require("../utilities/constants");

Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

const post = {
  pid: ObjectId,
  uid: { type: Schema.Types.ObjectId, ref: "user" },
  title: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 3;
      },
      message: (props) => `title must be greater than or equal to 3 characters`,
    },
  },
  description: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return v.length >= 25;
      },
      message: (props) =>
        `description must be greater than or equal to 25 characters`,
    },
  },
  image: {
    type: String,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now(),
  },
  modified: {
    type: Date,
    default: Date.now(),
  },
  status: {
    type: String,
    enum: postStatus,
    default: postStatus[1],
  },
};

const postSchema = new Schema(post, { versionKey: false });

const postModel = mongoose.model("post", postSchema);

function createPost(params) {
  return new Promise((resolve, reject) => {
    postModel
      .create(params)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

function getPost({ id, uid, status }) {
  let find = {};
  if (id) {
    find["_id"] = new mongoose.Types.ObjectId(id);
  }
  if (uid) {
    find["uid"] = new mongoose.Types.ObjectId(uid);
  }
  if (status) {
    find["status"] = status;
  } else if (status === undefined && uid === undefined) {
    find["status"] = postStatus[0];
  }
  return new Promise((resolve, reject) => {
    resolve(postModel.find(find).sort({ modified: -1 }).exec());
  });
}

module.exports = { createPost, getPost };
