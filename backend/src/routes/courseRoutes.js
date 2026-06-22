const express = require("express");
const router = express.Router();
const {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  buyCourse,
  getMyCourses,
} = require("../controllers/courseController");
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/adminMiddleware");

// Public
router.get("/", getAllCourses);

// Authenticated users
router.get("/my-courses", protect, getMyCourses);
router.post("/buy/:id", protect, buyCourse);

// Admin only
router.post("/create", protect, adminOnly, createCourse);
router.put("/update/:id", protect, adminOnly, updateCourse);
router.delete("/delete/:id", protect, adminOnly, deleteCourse);

// Public (must come after specific routes)
router.get("/:id", getCourseById);

module.exports = router;
