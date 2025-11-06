import User from "../models/user.js";
import bcrypt from "bcryptjs";
import generateToken from "../utility/generateToken.js";

export async function register(req, res) {
  try {
    const { username, email, password } = req.body;

    //check krege ki kya user phele se exit karta h ya nhi
    const existing = await User.findOne({ $or: [{ email }, { username }] });
    if (existing)
      return res.status(409).json({ message: "User already exists" });

    // Do not hash here; model pre-save hook will hash once
    const user = await User.create({ username, email, password });
    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.username,
        email: user.email,
        avatar: user.avatar,
        token: generateToken(user._id),
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user || !user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    let ok = await user.comparePassword(password);

    if (!ok) return res.status(401).json({ message: "Invalid credentials" });
    res.json({
      _id: user._id,
      name: user.username,
      email: user.email,
      avatar: user.avatar,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Login failed" });
  }
}

export const getme = async (req, res) => {
  try {
    if (!req._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json({
      data: {
        id: user._id,
        name: user.username,
        email: user.email,
        avatar: user.avatar,
        followers: user.followers,
        following: user.following,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch user" });
  }
};
