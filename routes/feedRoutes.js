const express = require("express");

const router = express.Router();

const feedController = require("../controllers/feedController");
const { validTitle, validContent } = require("../service/validators");

// GET /feed/posts
router.get("/posts", feedController.getPosts);

// POST /feed/post
router.post("/post", [validTitle, validContent], feedController.createPost);

//único post
router.get("/post/:postID", feedController.getPost);

router.put(
  "/post/:postID",
  [validTitle, validContent],
  feedController.updatePost
);

router.delete(
  "/post/:postID",
  feedController.deletePost
);

module.exports = router;
