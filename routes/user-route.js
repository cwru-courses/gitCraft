const express = require("express");
const router = express.Router();


const {
  createUser,
  userLogin,
} = require("../models/user-model");

router.post("/", function (req, res) {
  let requestBody = req.body;
  validate({ ...requestBody, action: "createUser" })
    .then((record) => {
      createUser(record)
        .then(async (data) => {
          res.status(200).json({
            message: "User was created Successfully",
            data: filterOut({ object: data, type: "key", from: "password" }),
          });
        })
        .catch((error) => {
          res.status(403).json({
            message: error.message,
            error: "User wasn't created",
          });
        });
    })
    .catch((customError) => {
      res.status(403).json({
        message: customError,
        error: "input validation failed",
      });
    });
});


router.post("/login", function (req, res) {
  let requestBody = req.body;
  validate({ ...requestBody, action: "login" })
    .then((record) => {
      userLogin(record)
        .then(async (data) => {
                  res.status(200).json({
            message: "User logged in Successfully",
            data: filterOut({ object: data, type: "key", from: "password" }),
            token,
          });
        })
        .catch((error) => {
          res.status(403).json({
            message: error.message,
            error: "User login failed",
          });
        });
    })
    .catch((customError) => {
      res.status(403).json({
        message: customError,
        error: "input validation failed",
      });
    });
});

module.exports = router;
