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
  getMyPosts,
} from "../controller/post.controller.js";
import { handleImageUpload } from "../middleware/cloudinaryUpload.middleware.js";

const postroute = Router();

postroute.post(
  "/",
  protect,
  upload.single("coverImage"),
  validate(postValidation),
  createPost
);
postroute.put(
  "/:id",
  protect,
  upload.single("coverImage"),
  handleImageUpload(false), // false = optional
  validate(postUpdateValidation),
  updatePost
);
postroute.get("/", protect, validate(queryValidation, "query"), getPosts);

export default postroute;
