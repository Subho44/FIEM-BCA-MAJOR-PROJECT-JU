const User = require("../models/User");
const Course = require("../models/Course");


exports.getDashboardData = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
   

    res.status(200).json({
      totalUsers,
      totalCourses,
      
    });
  } catch (error) {
    res.status(500).json({ message: "Admin dashboard failed", error: error.message });
  }
};