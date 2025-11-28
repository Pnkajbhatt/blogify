import { Router } from "express";
import { validate } from "../validation/auth.validation.js";
import protect from "../middleware/protect.js";
import { upload } from "../middleware/multer.middleware.js";
import { uploadOnCloudinary } from "../utility/cloudinary.js";
import {
  postUpdateValidation,
  postValidation,
  queryValidation,
} from "../validation/post.js";
import {
  createPost,
  updatePost,
  getPosts,
  getPost,
  deletePost,
  likePost,
  getMyPosts,
} from "../controller/post.controller.js";
import { handleImageUpload } from "../middleware/cloudinaryUpload.middleware.js";

const postroute = Router();

// Get all posts
postroute.get("/", protect, validate(queryValidation, "query"), getPosts);

// Get single post
postroute.get("/:id", getPost);

// Create post
postroute.post(
  "/",
  protect,
  upload.single("coverImage"),
  validate(postValidation),
  createPost
);

// Update post
postroute.put(
  "/:id",
  protect,
  upload.single("coverImage"),
  handleImageUpload(false), // false = optional
  validate(postUpdateValidation),
  updatePost
);

// Delete post
postroute.delete("/:id", protect, deletePost);

// Like/Unlike post
postroute.put("/:id/like", protect, likePost);

export default postroute;
