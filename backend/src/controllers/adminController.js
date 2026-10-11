import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Subject from "../models/Subject.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { getCache, setCache } from "../utils/cache.js";

/* =====================================================
   DASHBOARD STATS
===================================================== */
export const getDashboardStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    students,
    faculty,
    admins,
    totalCourses,
    totalSubjects,
    totalAssignments,
    totalSubmissions,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "student" }),
    User.countDocuments({ role: "faculty" }),
    User.countDocuments({ role: "admin" }),
    Course.countDocuments(),
    Subject.countDocuments(),
    Assignment.countDocuments(),
    Submission.countDocuments(),
  ]);

  res.status(200).json({
    totalUsers,
    students,
    faculty,
    admins,
    totalCourses,
    totalSubjects,
    totalAssignments,
    totalSubmissions,
  });
});

/* =====================================================
   CREATE USER (ADMIN ONLY)
===================================================== */
export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    throw new AppError("Name, email and password are required", 400);
  }

  const allowedRoles = ["student", "faculty", "admin"];
  if (role && !allowedRoles.includes(role)) {
    throw new AppError("Invalid role. Allowed roles: student, faculty, admin", 400);
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError("User with this email already exists", 400);
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role: role || "student",
    isActive: true,
  });

  const safeUser = await User.findById(user._id).select("-password");

  res.status(201).json({
    success: true,
    message: "User created successfully",
    user: safeUser,
  });
});

/* =====================================================
   GET ALL USERS
===================================================== */
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const search = req.query.search || "";
  const role = req.query.role || "";

  const query = {};

  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  if (role && ["student", "faculty", "admin"].includes(role)) {
    query.role = role;
  }

  const skip = (page - 1) * limit;

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await User.countDocuments(query);

  const response = {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit) || 1,
    count: users.length,
    users,
  };

  res.status(200).json({
    fromCache: false,
    ...response,
  });
});

/* =====================================================
   UPDATE USER
===================================================== */
export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, email, role, isActive } = req.body;

  const allowedRoles = ["student", "faculty", "admin"];

  if (role && !allowedRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role",
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  if (name) user.name = name;
  if (email) user.email = email;
  if (role) user.role = role;
  if (isActive !== undefined) user.isActive = Boolean(isActive);

  await user.save();

  const safeUser = await User.findById(id).select("-password");

  res.status(200).json({
    message: "User updated successfully",
    user: safeUser,
  });
});

/* =====================================================
   DELETE USER
===================================================== */
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  await User.findByIdAndDelete(id);

  res.status(200).json({
    message: "User deleted successfully",
  });
});

/* =====================================================
   CHANGE USER ROLE
===================================================== */
export const changeUserRole = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  const allowedRoles = ["student", "faculty", "admin"];

  if (!allowedRoles.includes(role)) {
    return res.status(400).json({
      message: "Invalid role",
    });
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.role = role;

  await user.save();

  const safeUser = await User.findById(id).select("-password");

  res.status(200).json({
    message: "Role updated successfully",
    user: safeUser,
  });
});

/* =====================================================
   ACTIVATE / DEACTIVATE USER
===================================================== */
export const toggleUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  user.isActive = !user.isActive;

  await user.save();

  const safeUser = await User.findById(id).select("-password");

  res.status(200).json({
    message: "User status updated",
    user: safeUser,
  });
});