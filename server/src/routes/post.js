import { Router } from "express";
import { validate } from "../validation/auth.validation.js";
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

postroute.post("/", validate(postValidation), createPost);
postroute.put("/:id", validate(postUpdateValidation), updatePost);
postroute.get("/", validate(queryValidation, "query"), getPosts);

export default postroute;
