import mongoose from "mongoose";
import slugify from "slugify";

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    likes: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    images: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Pre-save middleware to generate slug from title
PostSchema.pre("save", async function (next) {
  if (!this.isModified("title")) {
    return next();
  }

  // Generate base slug
  this.slug = slugify(this.title, {
    lower: true,
    strict: true, // Removes special characters
    trim: true,
  });

  // Check for existing slugs and make unique if needed
  const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, "i");
  const postsWithSlug = await this.constructor.find({ slug: slugRegEx });

  if (postsWithSlug.length) {
    this.slug = `${this.slug}-${postsWithSlug.length + 1}`;
  }

  next();
});

const Post = mongoose.model("Post", PostSchema);

export default Post;
