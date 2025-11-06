import jwt from "jsonwebtoken";

const generateToken = (id) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign({ id }, secret, {
    expiresIn: "2d",
  });
};

export default generateToken;
