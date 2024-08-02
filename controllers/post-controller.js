const mongoose = require("mongoose");

const { postModel } = require("../models/post-model");
const { postStatus } = require("../utilities/constants");
const { deleteFile } = require("../utilities/file-access");

function createPost(params) {
  return new Promise((resolve, reject) => {
    postModel
      .create(params)
      .then((res) => resolve(res))
      .catch((err) => reject(err));
  });
}

function getPost({ id, uid, status }) {
  let pipeline = [];
  if (status) {
    pipeline.push({ $match: { status } });
  } else if (status === undefined && uid === undefined) {
    let publicStatus = postStatus[0];
    pipeline.push({ $match: { status: publicStatus } });
  }
  if (id) {
    pipeline.push({ $match: { _id: new mongoose.Types.ObjectId(id) } });
  }
  if (uid) {
    pipeline.push({ $match: { uid: new mongoose.Types.ObjectId(uid) } });
  }
  if (pipeline.length !== 0) {
    pipeline.push({
      $lookup: {
        from: "users",
        localField: "uid",
        foreignField: "_id",
        as: "users",
      },
    });
    pipeline.push({
      $unwind: {
        path: "$users",
      },
    });
    pipeline.push({
      $project: {
        _id: 1,
        uid: 1,
        title: 1,
        description: 1,
        image: 1,
        created: 1,
        modified: 1,
        status: 1,
        author: "$users.name",
      },
    });
  }
  pipeline.push({ $sort: { modified: -1 } });
  return new Promise((resolve, reject) => {
    postModel
      .aggregate(pipeline)
      .then((result) => resolve(result))
      .catch((err) => reject(err));
  });
}

function updatePost(id, uid, requestBody) {
  getPost({ id, uid })
    .then((data) => {
      if (data.length === 0) {
        reject({ message: `post ${id} was not created by you` });
      }
      if (requestBody["image"]) {
        deleteFile(data[0].image);
      }
      requestBody["modified"] = Date.now();
      return postModel.findOneAndUpdate(
        { _id: new mongoose.Types.ObjectId(id) },
        { $set: requestBody },
        { new: true, runValidators: true }
      );
    })
    .catch((err) => reject(err));
}

function deletePost({ id, uid }) {
  return new Promise(function (resolve, reject) {
    getPost({ id, uid })
      .then(async (data) => {
        if (data.length > 0) {
          deleteFile(data[0].image);
          resolve(
            postModel
              .findOneAndDelete({ _id: new mongoose.Types.ObjectId(id) })
              .exec()
          );
        }
        reject({ message: `post ${id} was not created by you` });
      })
      .catch((err) => reject(err));
  });
}

module.exports = { createPost, getPost, updatePost, deletePost };
