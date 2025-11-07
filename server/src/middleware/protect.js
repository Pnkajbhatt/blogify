import jwt from "jsonwebtoken";

export default function protect(req, res, next) {
  try {
    const authHeader = req.headers?.authorization || "";
    const isBearer = authHeader.startsWith("Bearer ");
    if (!isBearer) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res
        .status(500)
        .json({ error: "Server misconfiguration: JWT secret missing" });
    }

    const decoded = jwt.verify(token, secret);
    req.userId = decoded.id || decoded._id || decoded.sub;
    req._id = req.userId; // compatibility with handlers checking req._id

    req.user = { _id: req.userId };
    if (!req.userId) {
      return res.status(401).json({ error: "Invalid token payload" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}
