import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import {
  getAssignments,
  getAssignmentById,
  createAssignment,
  updateAssignment,
  deleteAssignment,
} from "../controllers/assignmentController.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAssignments)
  .post(authorize("faculty", "admin"), createAssignment);

router.route("/:id")
  .get(getAssignmentById)
  .put(authorize("faculty", "admin"), updateAssignment)
  .delete(authorize("faculty", "admin"), deleteAssignment);

export default router;
