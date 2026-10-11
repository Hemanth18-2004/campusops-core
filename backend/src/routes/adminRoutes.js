import express from "express";

import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";

import {
  getDashboardStats,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  changeUserRole,
  toggleUserStatus,
} from "../controllers/adminController.js";

const router = express.Router();

/* ==========================================
   DASHBOARD
========================================== */

router.get(
  "/dashboard",
  protect,
  authorize("admin"),
  getDashboardStats
);

/* ==========================================
   USERS
========================================== */

router.get(
  "/users",
  protect,
  authorize("admin"),
  getAllUsers
);

router.post(
  "/users",
  protect,
  authorize("admin"),
  createUser
);

router.put(
  "/users/:id",
  protect,
  authorize("admin"),
  updateUser
);

router.delete(
  "/users/:id",
  protect,
  authorize("admin"),
  deleteUser
);

router.patch(
  "/users/:id/role",
  protect,
  authorize("admin"),
  changeUserRole
);

router.patch(
  "/users/:id/status",
  protect,
  authorize("admin"),
  toggleUserStatus
);

export default router;