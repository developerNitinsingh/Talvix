import User from "../models/User.js";
import Resume from "../models/Resume.js";

// GET : /api/admin/stats
// Comprehensive platform analytics and statistics
export const getAdminStats = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    // Totals & Time-based Counts
    const [
      totalUsers,
      totalAdmins,
      usersToday,
      usersThisWeek,
      usersThisMonth,
      totalResumes,
      resumesToday,
      resumesThisWeek,
      resumesThisMonth,
      publicResumes,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        role: "admin",
        ...(process.env.ADMIN_EMAIL
          ? { email: process.env.ADMIN_EMAIL.toLowerCase() }
          : { _id: null }),
      }),
      User.countDocuments({ createdAt: { $gte: startOfToday } }),
      User.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Resume.countDocuments(),
      Resume.countDocuments({ createdAt: { $gte: startOfToday } }),
      Resume.countDocuments({ createdAt: { $gte: sevenDaysAgo } }),
      Resume.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Resume.countDocuments({ public: true }),
    ]);

    const privateResumes = Math.max(0, totalResumes - publicResumes);
    const avgResumesPerUser =
      totalUsers > 0 ? Number((totalResumes / totalUsers).toFixed(2)) : 0;
    const publicShareRate =
      totalResumes > 0 ? Math.round((publicResumes / totalResumes) * 100) : 0;

    // Template Distribution
    const templateStatsRaw = await Resume.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$template", "classic"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const templateStats = templateStatsRaw.map((item) => ({
      template: item._id || "classic",
      count: item.count,
      percentage:
        totalResumes > 0 ? Math.round((item.count / totalResumes) * 100) : 0,
    }));

    // Top Skills Analytics
    const topSkillsRaw = await Resume.aggregate([
      { $unwind: "$skills" },
      {
        $project: {
          skillValue: {
            $cond: [
              { $eq: [{ $type: "$skills" }, "object"] },
              { $ifNull: ["$skills.skill", "$skills.skills"] },
              "$skills",
            ],
          },
        },
      },
      { $match: { skillValue: { $type: "string", $ne: "" } } },
      {
        $project: {
          skill: { $trim: { input: "$skillValue" } },
        },
      },
      { $match: { skill: { $ne: "" } } },
      { $group: { _id: "$skill", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 },
    ]);

    const topSkills = topSkillsRaw.map((s) => ({
      skill: s._id,
      count: s.count,
    }));

    // Top Professions Analytics
    const topProfessionsRaw = await Resume.aggregate([
      {
        $match: {
          "personal_info.profession": { $nin: ["", null, undefined] },
        },
      },
      {
        $group: {
          _id: { $trim: { input: "$personal_info.profession" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    const topProfessions = topProfessionsRaw.map((p) => ({
      profession: p._id,
      count: p.count,
    }));

    // 14-Day Timeline for Charts
    const [userTrendsRaw, resumeTrendsRaw] = await Promise.all([
      User.aggregate([
        { $match: { createdAt: { $gte: fourteenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
      Resume.aggregate([
        { $match: { createdAt: { $gte: fourteenDaysAgo } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    // Build complete 14 days dates array
    const trendMap = {};
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split("T")[0];
      const displayDate = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
      trendMap[dateStr] = {
        date: dateStr,
        label: displayDate,
        users: 0,
        resumes: 0,
      };
    }

    userTrendsRaw.forEach((item) => {
      if (trendMap[item._id]) trendMap[item._id].users = item.count;
    });

    resumeTrendsRaw.forEach((item) => {
      if (trendMap[item._id]) trendMap[item._id].resumes = item.count;
    });

    const timeline = Object.values(trendMap);

    // Recent Activity Feeds
    const [recentUsers, recentResumes] = await Promise.all([
      User.find().select("-password").sort({ createdAt: -1 }).limit(5),
      Resume.find()
        .populate("userId", "name email")
        .select("title template public accent_color createdAt updatedAt userId")
        .sort({ createdAt: -1 })
        .limit(5),
    ]);

    return res.status(200).json({
      success: true,
      stats: {
        totals: {
          users: totalUsers,
          admins: totalAdmins,
          resumes: totalResumes,
          publicResumes,
          privateResumes,
          avgResumesPerUser,
          publicShareRate,
        },
        activity: {
          usersToday,
          usersThisWeek,
          usersThisMonth,
          resumesToday,
          resumesThisWeek,
          resumesThisMonth,
        },
        templates: templateStats,
        skills: topSkills,
        professions: topProfessions,
        timeline,
        recent: {
          users: recentUsers,
          resumes: recentResumes,
        },
      },
    });
  } catch (error) {
    console.error("Error in getAdminStats:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to retrieve administrator statistics",
    });
  }
};

// GET : /api/admin/users
// Get paginated and searchable users list with resume counts
export const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const role = req.query.role || "";

    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (role && ["user", "admin"].includes(role)) {
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const [usersRaw, totalUsers] = await Promise.all([
      User.find(query)
        .select("-password")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(query),
    ]);

    // Attach resume counts for each user in the page
    const userIds = usersRaw.map((u) => u._id);
    const resumeCounts = await Resume.aggregate([
      { $match: { userId: { $in: userIds } } },
      { $group: { _id: "$userId", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    resumeCounts.forEach((r) => {
      countMap[r._id.toString()] = r.count;
    });

    const users = usersRaw.map((user) => ({
      ...user,
      resumesCount: countMap[user._id.toString()] || 0,
    }));

    return res.status(200).json({
      success: true,
      users,
      totalUsers,
      currentPage: page,
      totalPages: Math.ceil(totalUsers / limit) || 1,
    });
  } catch (error) {
    console.error("Error in getAllUsers:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch users",
    });
  }
};

// PUT : /api/admin/users/:userId/role
// Promote or demote user role
export const updateUserRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    if (!role || !["user", "admin"].includes(role)) {
      return res.status(400).json({
        message: "Invalid role specified. Must be 'user' or 'admin'.",
      });
    }

    if (role === "admin") {
      const targetUser = await User.findById(userId).select("email");
      const configuredEmail = process.env.ADMIN_EMAIL?.toLowerCase();

      if (
        !targetUser ||
        !configuredEmail ||
        targetUser.email.toLowerCase() !== configuredEmail
      ) {
        return res.status(403).json({
          message: "Only the configured administrator email can be promoted.",
        });
      }
    }

    // Prevent admin from demoting themselves
    if (req.userId.toString() === userId && role !== "admin") {
      return res.status(400).json({
        message: "You cannot revoke your own administrator privileges.",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true },
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      message: `User role updated to ${role} successfully`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error in updateUserRole:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update user role",
    });
  }
};

// DELETE : /api/admin/users/:userId
// Delete a user and cascade delete their resumes
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Prevent admin from deleting themselves
    if (req.userId.toString() === userId) {
      return res.status(400).json({
        message: "You cannot delete your own account from admin dashboard.",
      });
    }

    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete associated resumes
    await Resume.deleteMany({ userId });

    // Delete user
    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User and all associated resumes were deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete user",
    });
  }
};

// GET : /api/admin/resumes
// Get paginated and filterable resumes list across platform
export const getAllResumes = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const template = req.query.template || "";
    const isPublic = req.query.public;

    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (template) {
      query.template = template;
    }

    if (isPublic !== undefined && isPublic !== "") {
      query.public = isPublic === "true";
    }

    const skip = (page - 1) * limit;

    const [resumes, totalResumes] = await Promise.all([
      Resume.find(query)
        .populate("userId", "name email")
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Resume.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      resumes,
      totalResumes,
      currentPage: page,
      totalPages: Math.ceil(totalResumes / limit) || 1,
    });
  } catch (error) {
    console.error("Error in getAllResumes:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch resumes",
    });
  }
};

// DELETE : /api/admin/resumes/:resumeId
// Delete any resume by admin
export const deleteResumeByAdmin = async (req, res) => {
  try {
    const { resumeId } = req.params;

    const resume = await Resume.findByIdAndDelete(resumeId);
    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully by administrator.",
    });
  } catch (error) {
    console.error("Error in deleteResumeByAdmin:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete resume",
    });
  }
};

// POST : /api/admin/setup-admin
// Grant admin access only to the configured administrator email.
export const claimAdminRole = async (req, res) => {
  try {
    const userId = req.userId;
    const currentUser = await User.findById(userId);

    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const configuredEmail = process.env.ADMIN_EMAIL?.toLowerCase();
    const isConfiguredAdmin =
      Boolean(configuredEmail) &&
      currentUser.email.toLowerCase() === configuredEmail;

    if (isConfiguredAdmin) {
      currentUser.role = "admin";
      await currentUser.save();

      return res.status(200).json({
        success: true,
        message: "Congratulations! You now have Administrator privileges.",
        user: {
          _id: currentUser._id,
          name: currentUser.name,
          email: currentUser.email,
          role: currentUser.role,
        },
      });
    }

    return res.status(403).json({
      success: false,
      message:
        "Only the configured administrator email can receive admin privileges.",
    });
  } catch (error) {
    console.error("Error in claimAdminRole:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to assign admin role",
    });
  }
};
