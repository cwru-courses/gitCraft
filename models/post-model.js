const mongoose = require("mongoose");

const { postStatus } = require("../utilities/constants");
const { deleteFile } = require("../utilities/file-access");

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

module.exports = { postModel };
