import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { authorize } from "../middleware/authorizeMiddleware.js";
import {
  generatePlan,
  getLessonPlans,
  getLessonPlanById,
  createLessonPlan,
  updateLessonPlan,
  deleteLessonPlan,
} from "../controllers/lessonPlanController.js";

const router = express.Router();

router.use(protect);

router.post("/generate", authorize("faculty", "admin"), generatePlan);

router.route("/")
  .get(authorize("faculty", "admin"), getLessonPlans)
  .post(authorize("faculty", "admin"), createLessonPlan);

router.route("/:id")
  .get(authorize("faculty", "admin"), getLessonPlanById)
  .put(authorize("faculty", "admin"), updateLessonPlan)
  .delete(authorize("faculty", "admin"), deleteLessonPlan);

export default router;
