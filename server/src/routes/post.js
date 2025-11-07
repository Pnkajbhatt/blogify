import { Router } from "express";
import { validate } from "../validation/auth.validation.js";
import protect from "../middleware/protect.js";
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

const postroute = Router();

postroute.post("/", protect, validate(postValidation), createPost);
postroute.put("/:id", protect, validate(postUpdateValidation), updatePost);
postroute.get("/", protect, validate(queryValidation, "query"), getPosts);

export default postroute;
