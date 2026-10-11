import dotenv from "dotenv";
import app from "./app.js";
import connectDB from "./config/db.js";
import User from "./models/User.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    // TEMPORARY TEST — RUN ONCE
    /*
    const user = await User.create({
      name: "Test User",
      email: "test@campusops.com",
      password: "password123"
    });
    console.log("User created:", user.email);
    */

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
