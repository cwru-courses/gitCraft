/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the user
 *           example: 'John Doe'
 *         email:
 *           type: string
 *           description: The email id the user
 *           example: 'john.doe@email.com'
 *         password:
 *           type: string
 *           description: The password of the user
 *           example: 'IamaG0od_boy!'
 *     Login:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The email id the user
 *           example: 'john.doe@email.com'
 *         password:
 *           type: string
 *           description: The password of the user
 *           example: 'IamaG0od_boy!'
 *     Verification:
 *       type: object
 *       required:
 *         - email
 *         - otp
 *       properties:
 *         email:
 *           type: string
 *           description: The email id the user
 *           example: 'john.doe@email.com'
 *         otp:
 *           type: string
 *           description: The otp for confirming sign up
 *           example: 'rE)UZQ'
 *     Change:
 *       type: object
 *       required:
 *         - password
 *       properties:
 *         password:
 *           type: string
 *           description: The password of the user
 *           example: 'IamaG0od_boy!'
 *     Forgot:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         email:
 *           type: string
 *           description: The mail of the user
 *           example: 'john.doe@email.com'
 */
/**
 * @swagger
 * tags:
 *   name: User
 *   description: The user managing API
 * /user:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 *   put:
 *    summary: change the user password
 *    tags: [User]
 *    parameters:
 *      - name: x-access-token
 *        in: header
 *        schema:
 *          type: string
 *        required: true
 *        description: jwt token
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Change'
 *    responses:
 *      200:
 *        description: The user was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/User'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 * /user/login:
 *   post:
 *     summary: login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Login'
 *     responses:
 *       200:
 *         description: login user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * /user/otp:
 *   post:
 *     summary: verify the account
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Verification'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * /user/forgot:
 *   post:
 *     summary: forgot password
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Forgot'
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 * /user/logout:
 *   post:
 *     summary: logout
 *     tags: [User]
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: jwt token
 *     responses:
 *       200:
 *         description: The created user.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       500:
 *         description: Some server error
 */

const express = require("express");
const router = express.Router();

const {
  validate,
  filterOut,
  generateOTP,
  onlyJson,
} = require("../utilities/utils");
const { sendEmail } = require("../utilities/mail");
// const { generateJwtToken, verifyJwtToken } = require("../utilities/jwt-auth");
const {
  createUser,
  userLogin,
  markOTP,
  verifyUser,
  forgotUser,
} = require("../models/user-model");
const { logout } = require("../models/blacklist-model");

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

router.post("/otp", function (req, res) {
  let requestBody = req.body;
  validate({ ...requestBody, action: "otp" })
    .then((record) => {
      verifyUser(record)
        .then((data) => {
          res.status(200).json({
            message: data.message,
          });
        })
        .catch((error) => {
          res.status(403).json({
            message: error.message,
            error: "User wasn't verified",
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

router.post("/forgot", function (req, res) {
  let requestBody = req.body;
  validate({ ...requestBody, action: "forgot" })
    .then(async (record) => {
      let result = await forgotUser(record);

      result = onlyJson(result);

      let otp = await generateOTP();

      markOTP({ ...result, otp });

      sendEmail({ ...result, otp, type: "forgot" });

      res.status(200).json({
        message: `otp sent to ${result.email}`,
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
