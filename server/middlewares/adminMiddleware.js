import jwt from "jsonwebtoken";
import User from "../models/User.js";

const adminProtect = async (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized request: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const configuredEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const isConfiguredAdmin =
      Boolean(configuredEmail) && user.email.toLowerCase() === configuredEmail;

    if (!isConfiguredAdmin) {
      if (user.role === "admin") {
        await User.findByIdAndUpdate(user._id, { role: "user" });
      }

      return res
        .status(403)
        .json({ message: "Access denied: Administrator privileges required" });
    }

    req.user = user;
    req.userId = user._id;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({
        message: "Unauthorized request: Invalid token",
        error: error.message,
      });
  }
};

export { adminProtect };
