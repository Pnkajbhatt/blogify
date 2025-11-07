import post from "../models/post.js";
import mongoose from "mongoose";
// Adjust path as needed

// Rate limiting for likes (in production, use Redis instead)
const likeCooldown = new Map();

// @desc    Get all posts with advanced filtering
// @route   GET /api/posts
// @access  Public
export const getPosts = async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = queryValidation.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details[0].message,
      });
    }

    const {
      page = 1,
      limit = 10,
      tags,
      author,
      search,
      sort = "-createdAt",
      startDate,
      endDate,
      minLikes,
      featured,
      status = "published",
    } = value;

    // Build query - exclude soft-deleted posts
    const query = { isDeleted: false };

    // Filter by tag
    if (tags) {
      query.tags = { $in: tags.split(",").map((tag) => tag.trim()) };
    }

    // Filter by author
    if (author) {
      if (mongoose.Types.ObjectId.isValid(author)) {
        query.author = author;
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid author ID format",
        });
      }
    }

    // Search in title and content
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    // Date range filter
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    // Minimum likes filter
    if (minLikes) {
      query["likes.0"] = { $exists: true };
    }

    // Featured posts filter
    if (featured !== undefined) {
      query.featured = featured === "true";
    }

    // Status filter
    if (status) {
      query.status = status;
    }

    // Execute query with pagination
    const posts = await post
      .find(query)
      .populate("author", "name email avatar")
      .populate("likes.user", "name avatar")
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: posts,
    });
  } catch (error) {
    console.error("Get posts error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching posts",
      error: error.message,
    });
  }
};

// @desc    Get single post by slug or ID
// @route   GET /api/posts/:identifier
// @access  Public
export const getPost = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Check if identifier is a valid ObjectId or slug
    const query = mongoose.Types.ObjectId.isValid(identifier)
      ? { _id: identifier, isDeleted: false }
      : { slug: identifier, isDeleted: false };

    const post = await post
      .findOne(query)
      .populate("author", "name email avatar bio")
      .populate("likes.user", "name avatar");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Increment view count (optional)
    post.views = (post.views || 0) + 1;
    await post.save();

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error("Get post error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching post",
      error: error.message,
    });
  }
};

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res) => {
  try {
    const {
      title,
      content,
      tags,
      images,
      status = "published",
      featured = false,
    } = value;

    // Create post with authenticated user as author
    const post = await post.create({
      title: title.trim(),
      content: content.trim(),
      author: req.user.id,
      tags: tags || [],
      images: images || [],
      status,
      featured,
    });

    // Populate author details
    await post.populate("author", "name email avatar");

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    console.error("Create post error:", error);

    // Handle duplicate slug error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "A post with similar title already exists",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error creating post",
      error: error.message,
    });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
// @access  Private
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate request body using Joi
    const { error, value } = postUpdateValidation.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details[0].message,
      });
    }

    const { title, content, tags, images, status, featured } = value;

    let post = await post.findOne({ _id: id, isDeleted: false });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this post",
      });
    }

    // Update fields
    if (title) post.title = title.trim();
    if (content) post.content = content.trim();
    if (tags) post.tags = tags;
    if (images) post.images = images;
    if (status) post.status = status;
    if (featured !== undefined) post.featured = featured;

    await post.save();
    await post.populate("author", "name email avatar");
    await post.populate("likes.user", "name avatar");

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (error) {
    console.error("Update post error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating post",
      error: error.message,
    });
  }
};

// @desc    Delete post (soft delete)
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await post.findOne({ _id: id, isDeleted: false });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user is the author
    if (post.author.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this post",
      });
    }

    // Soft delete instead of hard delete
    post.isDeleted = true;
    post.deletedAt = new Date();
    await post.save();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
      data: {},
    });
  } catch (error) {
    console.error("Delete post error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting post",
      error: error.message,
    });
  }
};

// @desc    Like/Unlike post with rate limiting
// @route   PUT /api/posts/:id/like
// @access  Private
export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Rate limiting check (5 second cooldown)
    const key = `${userId}-${id}`;
    const lastLikeTime = likeCooldown.get(key);
    if (lastLikeTime && Date.now() - lastLikeTime < 5000) {
      return res.status(429).json({
        success: false,
        message: "Please wait before liking again",
      });
    }

    const post = await post.findOne({ _id: id, isDeleted: false });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Check if user already liked the post
    const likeIndex = post.likes.findIndex(
      (like) => like.user.toString() === userId
    );

    let liked = false;

    if (likeIndex > -1) {
      // Unlike: Remove like
      post.likes.splice(likeIndex, 1);
      likeCooldown.delete(key);
    } else {
      // Like: Add like
      post.likes.push({ user: userId });
      liked = true;
      likeCooldown.set(key, Date.now());

      // Remove rate limit after 5 seconds
      setTimeout(() => {
        likeCooldown.delete(key);
      }, 5000);
    }

    await post.save();
    await post.populate("author", "name email avatar");
    await post.populate("likes.user", "name avatar");

    res.status(200).json({
      success: true,
      message: liked ? "Post liked" : "Post unliked",
      data: post,
      liked,
      likesCount: post.likes.length,
    });
  } catch (error) {
    console.error("Like post error:", error);
    res.status(500).json({
      success: false,
      message: "Error liking post",
      error: error.message,
    });
  }
};

// @desc    Get posts by authenticated user
// @route   GET /api/posts/my/posts
// @access  Private
export const getMyPosts = async (req, res) => {
  try {
    // Validate query parameters
    const { error, value } = queryValidation.validate(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        error: error.details[0].message,
      });
    }

    const { page = 1, limit = 10, status } = value;

    const query = { author: req.user.id, isDeleted: false };

    if (status) {
      query.status = status;
    }

    const posts = await post
      .find(query)
      .populate("author", "name email avatar")
      .populate("likes.user", "name avatar")
      .sort("-createdAt")
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await post.countDocuments(query);

    res.status(200).json({
      success: true,
      count: posts.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      data: posts,
    });
  } catch (error) {
    console.error("Get my posts error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching your posts",
      error: error.message,
    });
  }
};

// @desc    Get featured posts
// @route   GET /api/posts/featured
// @access  Public
export const getFeaturedPosts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const posts = await post
      .find({
        featured: true,
        isDeleted: false,
        status: "published",
      })
      .populate("author", "name email avatar")
      .populate("likes.user", "name avatar")
      .sort("-createdAt")
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Get featured posts error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching featured posts",
      error: error.message,
    });
  }
};

// @desc    Get popular posts (most liked)
// @route   GET /api/posts/popular
// @access  Public
export const getPopularPosts = async (req, res) => {
  try {
    const { limit = 5 } = req.query;

    const posts = await post
      .find({
        isDeleted: false,
        status: "published",
        "likes.0": { $exists: true },
      })
      .populate("author", "name email avatar")
      .populate("likes.user", "name avatar")
      .sort({ likes: -1, createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (error) {
    console.error("Get popular posts error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching popular posts",
      error: error.message,
    });
  }
};
