import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  // Expect token as: Authorization: Bearer <token>
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify JWT
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user and exclude password
      const user = await User.findById(decoded.id).select("-password");

      // User no longer exists
      if (!user) {
        return res.status(401).json({
          message: "User not found"
        });
      }

      // User has been deactivated
      if (!user.isActive) {
        return res.status(403).json({
          message: "Account is inactive"
        });
      }

      req.user = user;

      next();
    } catch (error) {
      return res.status(401).json({
        message: "Not authorized"
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      message: "No token provided"
    });
  }
};