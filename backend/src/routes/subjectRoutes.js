import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import {
  getSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subjectController.js";

const router = express.Router();

// All subject endpoints require authentication
router.use(protect);

router.route("/")
  .get(getSubjects)
  .post(authorize("admin"), createSubject);

router.route("/:id")
  .get(getSubjectById)
  .put(authorize("admin"), updateSubject)
  .delete(authorize("admin"), deleteSubject);

export default router;
