/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - image
 *       properties:
 *         title:
 *           type: string
 *           description: The name of the post
 *           example: 'Chicken Tikka Masala Recipe'
 *         description:
 *           type: string
 *           description: The description of the post
 *           example: 'Marinate bite-sized chicken chunks in yogurt, lemon juice, garlic, ginger, salt, cumin, garam masala, and paprika for at least 1 hour, then bake on skewers at 500°F for 15 minutes, and finally cook with a fragrant sauce made of sautéed onions, ginger, garlic, spices, tomato puree, tomato sauce, water, and cream before serving with cilantro over rice or naan.'
 *         status:
 *           type: string
 *           description: The status of the post
 *           example: 'private'
 *           enum:
 *             - public
 *             - private
 *     Edit:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The name of the post
 *           example: 'Chicken Tikka Masala Recipe'
 *         description:
 *           type: string
 *           description: The description of the post
 *           example: 'Marinate bite-sized chicken chunks in yogurt, lemon juice, garlic, ginger, salt, cumin, garam masala, and paprika for at least 1 hour, then bake on skewers at 500°F for 15 minutes, and finally cook with a fragrant sauce made of sautéed onions, ginger, garlic, spices, tomato puree, tomato sauce, water, and cream before serving with cilantro over rice or naan.'
 *         status:
 *           type: string
 *           description: The status of the post
 *           example: 'private'
 *           enum:
 *             - public
 *             - private
 *     Get:
 *       type: object
 *       properties:
 *         status:
 *           type: string
 *           description: The status of the post
 *           example: 'private'
 *           enum:
 *             - public
 *             - private
 */
/**
 * @swagger
 * tags:
 *   name: Post
 *   description: The post managing API
 * /post:
 *   post:
 *     summary: Create a new post
 *     tags: [Post]
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: jwt token
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *               title:
 *                 type: string
 *                 description: The name of the post
 *                 example: 'Chicken Tikka Masala Recipe'
 *               description:
 *                 type: string
 *                 description: The description of the post
 *                 example: 'Marinate bite-sized chicken chunks in yogurt, lemon juice, garlic, ginger, salt, cumin, garam masala, and paprika for at least 1 hour, then bake on skewers at 500°F for 15 minutes, and finally cook with a fragrant sauce made of sautéed onions, ginger, garlic, spices, tomato puree, tomato sauce, water, and cream before serving with cilantro over rice or naan.'
 *               status:
 *                 type: string
 *                 description: The status of the post
 *                 example: 'private'
 *                 enum:
 *                   - public
 *                   - private
 *             required:
 *               - image
 *               - title
 *               - description
 *     responses:
 *       200:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PostResponse'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 status:
 *                   type: integer
 *       500:
 *         description: Some server error
 * /post/get:
 *   post:
 *     summary: get posts
 *     tags: [Post]
 *     parameters:
 *       - name: x-access-token
 *         in: header
 *         schema:
 *           type: string
 *         required: true
 *         description: jwt token
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Get'
 *     responses:
 *       200:
 *         description: The created post.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Post'
 *       500:
 *         description: Some server error
 */

const express = require("express");

const router = express.Router();

const { validate, filterOut } = require("../utilities/utils");

const { createPost, getPost } = require("../models/post-model");

const { upload } = require("../utilities/file-upload");

router.post("/", upload, function (req, res) {
  let uid = req.id;
  let requestBody = req.body;
  validate({
    ...requestBody,
    image: req.file?.path,
    action: "createPost",
  })
    .then((record) => {
      createPost({ ...record, uid })
        .then((data) => {
          res.status(200).json({
            message: "Post was created Successfully",
            data: data,
          });
        })
        .catch((error) => {
          res.status(403).json({
            message: error.message,
            error: "Post wasn't created",
          });
        });
    })
    .catch((customError) => {
      res.status(403).json({
        message: customError,
        error: "Post validation failed",
      });
    });
});

router.post("/get", function (req, res) {
  let uid = req.id;
  let requestBody = req.body;
  validate({ ...requestBody, action: "getPost" })
    .then((record) => {
      if (record["status"]) {
        record["uid"] = uid;
      }
      getPost(
        filterOut({
          object: record,
          type: "value",
          from: undefined,
        })
      )
        .then((records) => {
          res.status(200).json({
            message: "Posts fetched Successfully",
            data: records,
          });
        })
        .catch((error) => {
          res.status(403).json({
            message: error.message,
            error: "Error while fetching posts",
          });
        });
    })
    .catch((err) =>
      res.status(403).json({
        message: err,
      })
    );
});

module.exports = router;
