// middlewares/cloudinaryUpload.middleware.js
import { uploadOnCloudinary } from "../utility/cloudinary.js";

export const handleImageUpload = (required = true) => {
  return async (req, res, next) => {
    try {
      if (!req.file) {
        if (required) {
          return res.status(400).json({ error: "Cover image is required" });
        }
        return next(); // Skip if not required (for updates)
      }

      const cloudinaryResult = await uploadOnCloudinary(req.file.path);

      if (!cloudinaryResult) {
        return res.status(500).json({ error: "Failed to upload image" });
      }

      req.body.coverImage = cloudinaryResult.secure_url;
      next();
    } catch (error) {
      next(error);
    }
  };
};
