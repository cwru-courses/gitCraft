const mongoose = require("mongoose");

const { emailRegex, userStatus } = require("../utilities/constants");

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

module.exports = { userModel };
