import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Subject from "../models/Subject.js";
import Assignment from "../models/Assignment.js";
import Submission from "../models/Submission.js";
import LessonPlan from "../models/LessonPlan.js";

dotenv.config();

const seed = async () => {
  try {
    await connectDB();
    console.log("🌱 Connected to database for seeding...");

    // 1. Create or ensure Users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash("admin123", salt);
    const facultyPassword = await bcrypt.hash("faculty123", salt);
    const studentPassword = await bcrypt.hash("student123", salt);

    let admin = await User.findOne({ email: "admin@campusops.com" });
    if (!admin) {
      admin = await User.create({
        name: "Dr. Eleanor Vance (Dean)",
        email: "admin@campusops.com",
        password: adminPassword,
        role: "admin",
        isActive: true,
      });
      console.log("✅ Admin user created: admin@campusops.com / admin123");
    } else {
      admin.role = "admin";
      admin.password = adminPassword;
      await admin.save();
    }

    let faculty = await User.findOne({ email: "faculty@campusops.com" });
    if (!faculty) {
      faculty = await User.create({
        name: "Prof. Alan Turing",
        email: "faculty@campusops.com",
        password: facultyPassword,
        role: "faculty",
        isActive: true,
      });
      console.log("✅ Faculty user created: faculty@campusops.com / faculty123");
    } else {
      faculty.role = "faculty";
      faculty.password = facultyPassword;
      await faculty.save();
    }

    let student = await User.findOne({ email: "student@campusops.com" });
    if (!student) {
      student = await User.create({
        name: "Alex Johnson",
        email: "student@campusops.com",
        password: studentPassword,
        role: "student",
        isActive: true,
      });
      console.log("✅ Student user created: student@campusops.com / student123");
    } else {
      student.role = "student";
      student.password = studentPassword;
      await student.save();
    }

    // 2. Create Courses if none exist
    let cseCourse = await Course.findOne({ code: "CSE-100" });
    if (!cseCourse) {
      cseCourse = await Course.create({
        name: "Computer Science & Engineering",
        code: "CSE-100",
        department: "School of Computing",
        credits: 4,
        description: "Core undergraduate degree covering algorithms, systems architecture, and computing foundations.",
        faculty: faculty._id,
      });
      console.log("✅ Course created: CSE-100");
    }

    let aiCourse = await Course.findOne({ code: "AIDS-200" });
    if (!aiCourse) {
      aiCourse = await Course.create({
        name: "Artificial Intelligence & Data Science",
        code: "AIDS-200",
        department: "School of AI",
        credits: 4,
        description: "Specialized curriculum focusing on statistical learning, deep networks, and computational intelligence.",
        faculty: faculty._id,
      });
      console.log("✅ Course created: AIDS-200");
    }

    // 3. Create Subjects
    let dsaSubject = await Subject.findOne({ code: "CS-201" });
    if (!dsaSubject) {
      dsaSubject = await Subject.create({
        name: "Data Structures & Algorithms",
        code: "CS-201",
        course: cseCourse._id,
        faculty: faculty._id,
        semester: 3,
        description: "In-depth study of algorithmic complexity, balanced trees, graph algorithms, and dynamic programming.",
      });
      console.log("✅ Subject created: CS-201");
    }

    let dbmsSubject = await Subject.findOne({ code: "CS-202" });
    if (!dbmsSubject) {
      dbmsSubject = await Subject.create({
        name: "Database Systems & Design",
        code: "CS-202",
        course: cseCourse._id,
        faculty: faculty._id,
        semester: 3,
        description: "Relational modeling, SQL optimization, ACID transactions, and distributed data systems.",
      });
      console.log("✅ Subject created: CS-202");
    }

    // 4. Create Assignments
    let assignment1 = await Assignment.findOne({ title: "Binary Search Trees & AVL Balancing" });
    if (!assignment1) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);

      assignment1 = await Assignment.create({
        title: "Binary Search Trees & AVL Balancing",
        description: "Implement self-balancing AVL tree rotation routines (left, right, left-right, right-left) in TypeScript or Python. Provide time-complexity proofs.",
        subject: dsaSubject._id,
        course: cseCourse._id,
        faculty: faculty._id,
        dueDate: dueDate,
        maxMarks: 100,
      });
      console.log("✅ Assignment created: Binary Search Trees");
    }

    let assignment2 = await Assignment.findOne({ title: "Database Normalization Case Study" });
    if (!assignment2) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      assignment2 = await Assignment.create({
        title: "Database Normalization Case Study",
        description: "Deconstruct the provided unnormalized hospital management dataset into 3NF and BCNF relation schemas. Provide functional dependency graphs.",
        subject: dbmsSubject._id,
        course: cseCourse._id,
        faculty: faculty._id,
        dueDate: dueDate,
        maxMarks: 50,
      });
      console.log("✅ Assignment created: Database Normalization");
    }

    // 5. Create Submissions
    let submission1 = await Submission.findOne({ assignment: assignment1._id, student: student._id });
    if (!submission1) {
      submission1 = await Submission.create({
        assignment: assignment1._id,
        student: student._id,
        content: `Implemented AVL tree node rotation logic with height balancing factor calculation. Tested with 10,000 randomized insertions and validated O(log N) lookup invariants. Repository commit link included.`,
        status: "graded",
        grade: 95,
        feedback: "Exemplary solution! The balance factor checks and rotation tests are rigorously engineered. Great work!",
        submittedAt: new Date(Date.now() - 86400000 * 2),
        gradedAt: new Date(),
      });
      console.log("✅ Graded submission created for Alex Johnson");
    }

    // 6. Create Lesson Plan
    let plan = await LessonPlan.findOne({ topic: "Graph Traversal: BFS vs DFS" });
    if (!plan) {
      await LessonPlan.create({
        subject: "Data Structures & Algorithms",
        topic: "Graph Traversal: BFS vs DFS",
        duration: "60 minutes",
        objectives: [
          "Differentiate queue-based BFS and stack/recursive DFS",
          "Analyze time and space complexity over adjacency lists and matrices",
          "Apply BFS to shortest path problems and DFS to cycle detection",
        ],
        content: `# Graph Traversal: Breadth-First Search & Depth-First Search
**Subject:** Data Structures & Algorithms  
**Duration:** 60 minutes  
**Target:** 2nd Year Computer Science  

### Objectives
- Master the conceptual and algorithmic differences between BFS (queue) and DFS (stack/recursion).
- Understand cycle detection using 3-color graph marking.

### Timeline
- **00-10m:** Graph representation review (Adjacency Matrix vs List).
- **10-30m:** BFS algorithmic trace and shortest path property.
- **30-45m:** DFS implementation and topological ordering applications.
- **45-60m:** Interactive live-coding problem & exit ticket.`,
        faculty: faculty._id,
      });
      console.log("✅ Saved Lesson Plan created for Faculty");
    }

    console.log("🎉 Seeding completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
};

seed();
