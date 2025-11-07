import Joi from "joi";

// Query validation for GET posts
export const queryValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  tags: Joi.string().optional(),
  author: Joi.string().optional(),
  search: Joi.string().optional(),
  sort: Joi.string().optional().default("-createdAt"),
  startDate: Joi.date().iso().optional(),
  endDate: Joi.date().iso().optional(),
  minLikes: Joi.number().integer().min(0).optional(),
  featured: Joi.boolean().optional(),
  status: Joi.string()
    .valid("draft", "published", "archived")
    .default("published"),
});

// Validation for creating a post
export const postValidation = Joi.object({
  title: Joi.string().trim().min(5).max(200).required().messages({
    "string.empty": "Title is required",
    "string.min": "Title must be at least 5 characters long",
    "string.max": "Title cannot exceed 200 characters",
  }),
  content: Joi.string().trim().min(10).required().messages({
    "string.empty": "Content is required",
    "string.min": "Content must be at least 10 characters long",
  }),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(10).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  status: Joi.string()
    .valid("draft", "published", "archived")
    .default("published"),
  featured: Joi.boolean().default(false),
});

// Validation for updating a post (all fields optional)
export const postUpdateValidation = Joi.object({
  title: Joi.string().trim().min(5).max(200).optional(),
  content: Joi.string().trim().min(10).optional(),
  tags: Joi.array().items(Joi.string().trim().max(50)).max(10).optional(),
  images: Joi.array().items(Joi.string().uri()).optional(),
  status: Joi.string().valid("draft", "published", "archived").optional(),
  featured: Joi.boolean().optional(),
});
