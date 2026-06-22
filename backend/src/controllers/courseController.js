const Course = require("../models/Course");
const User = require("../models/User");

// GET /api/courses
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("creator", "name")
      .sort({ createdAt: -1 });
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};

// GET /api/courses/:id
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "creator",
      "name email"
    );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json(course);
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    res.status(500).json({ message: "Error fetching course" });
  }
};

// POST /api/courses/create  (admin only)
const createCourse = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;

    if (!title || !description || price === undefined) {
      return res.status(400).json({ message: "Title, description, and price are required" });
    }

    const course = await Course.create({
      title,
      description,
      price,
      image: image || "https://placehold.co/600x400/000000/FFFFFF?text=Course",
      creator: req.user._id,
    });

    const populated = await course.populate("creator", "name");
    res.status(201).json(populated);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    res.status(500).json({ message: "Error creating course" });
  }
};

// PUT /api/courses/update/:id  (admin only)
const updateCourse = async (req, res) => {
  try {
    const { title, description, price, image } = req.body;

    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (title) course.title = title;
    if (description) course.description = description;
    if (price !== undefined) course.price = price;
    if (image) course.image = image;

    await course.save();
    const updated = await course.populate("creator", "name");
    res.status(200).json(updated);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ message: messages.join(". ") });
    }
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    res.status(500).json({ message: "Error updating course" });
  }
};

// DELETE /api/courses/delete/:id  (admin only)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await Course.findByIdAndDelete(req.params.id);

    // Remove from all users' purchasedCourses
    await User.updateMany(
      { purchasedCourses: req.params.id },
      { $pull: { purchasedCourses: req.params.id } }
    );

    res.status(200).json({ message: "Course deleted successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    res.status(500).json({ message: "Error deleting course" });
  }
};

// POST /api/courses/buy/:id
const buyCourse = async (req, res) => {
  try {
    const courseId = req.params.id;
    const userId = req.user._id;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    const user = await User.findById(userId);

    const alreadyPurchased = user.purchasedCourses.some(
      (id) => id.toString() === courseId
    );

    if (alreadyPurchased) {
      return res.status(409).json({ message: "Course already purchased" });
    }

    user.purchasedCourses.push(courseId);
    await user.save();

    course.studentsEnrolled.push(userId);
    await course.save();

    res.status(200).json({ message: "Course purchased successfully" });
  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid course ID" });
    }
    res.status(500).json({ message: "Error purchasing course" });
  }
};

// GET /api/courses/my-courses
const getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "purchasedCourses",
      populate: { path: "creator", select: "name" },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.purchasedCourses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching purchased courses" });
  }
};

module.exports = {
  getAllCourses,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  buyCourse,
  getMyCourses,
};
