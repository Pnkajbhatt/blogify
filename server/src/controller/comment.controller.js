import Comment from "../models/comment.js";
import Post from "../models/post.js";
import mongoose from "mongoose";

// @desc    Add a new comment to a post
// @route   POST /api/comments
// @access  Private
export const addComment = async (req, res) => {
  try {
    const { text, post, parentId } = req.body;

    // Validate that the post exists
    const existingPost = await Post.findById(post);
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Validate parent comment if provided
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return res.status(404).json({
          success: false,
          message: "Parent comment not found",
        });
      }
    }

    // Create the comment
    const comment = await Comment.create({
      text: text.trim(),
      post,
      author: req.user._id,
      parentId: parentId || null,
    });

    // Populate author details
    await comment.populate("author", "username avatar");

    res.status(201).json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({
      success: false,
      message: "Error adding comment",
      error: error.message,
    });
  }
};

// @desc    Get all comments for a specific post
// @route   GET /api/comments/post/:postId
// @access  Public
export const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    // Validate post ID format
    if (!mongoose.Types.ObjectId.isValid(postId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid post ID format",
      });
    }

    // Get comments with nested structure
    const comments = await Comment.find({ post: postId })
      .populate("author", "username avatar")
      .sort({ createdAt: 1 }) // Oldest first for chronological order
      .lean();

    // Organize comments into nested structure
    const commentMap = {};
    const rootComments = [];

    comments.forEach((comment) => {
      comment.replies = [];
      commentMap[comment._id] = comment;
    });

    comments.forEach((comment) => {
      if (comment.parentId) {
        const parent = commentMap[comment.parentId];
        if (parent) {
          parent.replies.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    });

    res.status(200).json({
      success: true,
      count: comments.length,
      data: rootComments,
    });
  } catch (error) {
    console.error("Get comments error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching comments",
      error: error.message,
    });
  }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the comment
    const comment = await Comment.findById(id);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found",
      });
    }

    // Check if the user is the author of the comment
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this comment",
      });
    }

    // Delete the comment (this will also delete replies if needed)
    await Comment.findByIdAndDelete(id);

    // Optionally, you might want to handle replies here
    // For example, delete all replies or reassign them

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("Delete comment error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting comment",
      error: error.message,
    });
  }
};
