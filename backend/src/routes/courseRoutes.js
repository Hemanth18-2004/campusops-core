import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import {
  getCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
} from "../controllers/courseController.js";

const router = express.Router();

// All course endpoints require authentication
router.use(protect);

router.route("/")
  .get(getCourses)
  .post(authorize("admin"), createCourse);

router.route("/:id")
  .get(getCourseById)
  .put(authorize("admin"), updateCourse)
  .delete(authorize("admin"), deleteCourse);

export default router;
