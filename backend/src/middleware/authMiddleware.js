import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/auth/UserModel.js";

export const protect = asyncHandler(async (req, res, next) => {
  try {
    // Check if user logged in
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Not Authorized, please login" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user details
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not Found!" });
    }

    // Set user details in request object
    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ message: "Not Authorized, token failed!" });
  }
});

//admin Middleware

export const adminMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    //if admin go to next middleware
    next();
    return;
  }
  //if not admin send 403 forbidden
  res.status(403).json({ message: "Only admins can do this" });
});

export const creatorMiddleware = asyncHandler(async (req, res, next) => {
  if (
    (req.user && req.user.role === "creator") ||
    (req.user && req.user.role === "admin")
  ) {
    //if admin go to next middleware
    next();
    return;
  }
  //if not admin send 403 forbidden
  res.status(403).json({ message: "Only creator or admin can do this" });
});

//verified middleware

export const verifiedMiddleware = asyncHandler(async (req, res, next) => {
  if(req.user && req.user.isVerified){
    next();
    return;
  }
  res.status(403).json({ message: "Please Verify your email" });
});
