import express from "express";
import {
  addComment,
  getCommentsByPost,
  deleteComment,
} from "../controller/comment.controller.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Add comment to post
router.post("/", authMiddleware, addComment);

// Get all comments for a post
router.get("/:postId", getCommentsByPost);

// Delete comment
router.delete("/:id", authMiddleware, deleteComment);

export default router;
