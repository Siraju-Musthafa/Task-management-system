const mongoose = require("mongoose");
const Task = require("../models/Task");
const User = require("../models/User");

// Helper: Check valid MongoDB ObjectId
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// Helper: Check whether a user can access a task
const canAccessTask = (task, user) => {
  if (user.role === "Admin") {
    return true;
  }

  if (user.role === "Manager") {
    return (
      task.createdBy.toString() === user._id.toString() ||
      task.assignedTo.toString() === user._id.toString()
    );
  }

  return task.assignedTo.toString() === user._id.toString();
};

// Helper: Check whether a user can manage task details
const canManageTask = (task, user) => {
  if (user.role === "Admin") {
    return true;
  }

  return (
    user.role === "Manager" && task.createdBy.toString() === user._id.toString()
  );
};

// CREATE TASK
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, priority, dueDate } = req.body;

    // Validate required fields
    if (!title || !description || !assignedTo || !dueDate) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required task fields",
      });
    }

    // Validate assigned user ID
    if (!isValidId(assignedTo)) {
      return res.status(400).json({
        success: false,
        message: "Invalid assigned user ID",
      });
    }

    // Validate priority
    const allowedPriorities = ["Low", "Medium", "High"];

    if (priority !== undefined && !allowedPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task priority",
      });
    }

    // Validate due date
    const parsedDueDate = new Date(dueDate);

    if (Number.isNaN(parsedDueDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date",
      });
    }

    // Check assigned user
    const assignedUser = await User.findById(assignedTo);

    if (!assignedUser) {
      return res.status(404).json({
        success: false,
        message: "Assigned user not found",
      });
    }

    // Admin can assign to Managers and Users.
    // Managers can assign only to Users.
    if (req.user.role === "Manager" && assignedUser.role !== "User") {
      return res.status(403).json({
        success: false,
        message: "Managers can assign tasks only to Users",
      });
    }

    if (!["User", "Manager"].includes(assignedUser.role)) {
      return res.status(400).json({
        success: false,
        message: "Tasks cannot be assigned to this role",
      });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user._id,
      priority: priority || "Medium",
      dueDate: parsedDueDate,
    });

    const populatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    // Socket.io notification
    const io = req.app.get("io");

    io.to(populatedTask.assignedTo._id.toString()).emit("taskAssigned", {
      message: "A new task has been assigned to you",
      task: populatedTask,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      task: populatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET ALL TASKS
exports.getAllTasks = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      priority,
      assignedTo,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const currentPage = Math.max(parseInt(page, 10) || 1, 1);
    const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 10, 1), 100);

    const filter = {};

    // Role-based filtering
    if (req.user.role === "Admin") {
      // Admin can see all tasks
    } else if (req.user.role === "Manager") {
      filter.$or = [{ createdBy: req.user._id }, { assignedTo: req.user._id }];
    } else {
      filter.assignedTo = req.user._id;
    }

    // Search
    if (search && search.trim()) {
      filter.title = {
        $regex: search.trim(),
        $options: "i",
      };
    }

    // Status filter
    if (status) {
      if (!["Pending", "In Progress", "Completed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task status",
        });
      }

      filter.status = status;
    }

    // Priority filter
    if (priority) {
      if (!["Low", "Medium", "High"].includes(priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid task priority",
        });
      }

      filter.priority = priority;
    }

    // Assigned user filter
    if (assignedTo) {
      if (!isValidId(assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID",
        });
      }

      filter.assignedTo = assignedTo;
    }

    // Sorting
    const allowedSortFields = [
      "createdAt",
      "updatedAt",
      "dueDate",
      "title",
      "priority",
      "status",
    ];

    if (!allowedSortFields.includes(sortBy)) {
      return res.status(400).json({
        success: false,
        message: "Invalid sorting field",
      });
    }

    const sortOrder = order === "asc" ? 1 : -1;

    const totalTasks = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ [sortBy]: sortOrder })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit);

    return res.status(200).json({
      success: true,
      count: tasks.length,
      totalTasks,
      totalPages: Math.ceil(totalTasks / pageLimit),
      currentPage,
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET TASK BY ID
exports.getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!canAccessTask(task, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to access this task",
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE TASK DETAILS
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!canManageTask(task, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this task",
      });
    }

    const allowedFields = [
      "title",
      "description",
      "assignedTo",
      "priority",
      "dueDate",
    ];

    for (const field of Object.keys(req.body)) {
      if (!allowedFields.includes(field)) {
        return res.status(400).json({
          success: false,
          message: `You cannot update the ${field} field here`,
        });
      }
    }

    if (
      req.body.title !== undefined &&
      (!req.body.title.trim() || req.body.title.trim().length < 3)
    ) {
      return res.status(400).json({
        success: false,
        message: "Task title must contain at least 3 characters",
      });
    }

    if (req.body.priority !== undefined) {
      if (!["Low", "Medium", "High"].includes(req.body.priority)) {
        return res.status(400).json({
          success: false,
          message: "Invalid priority",
        });
      }
    }

    if (req.body.dueDate !== undefined) {
      const date = new Date(req.body.dueDate);

      if (Number.isNaN(date.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid due date",
        });
      }

      task.dueDate = date;
    }

    if (req.body.assignedTo !== undefined) {
      if (!isValidId(req.body.assignedTo)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assigned user ID",
        });
      }

      const assignedUser = await User.findById(req.body.assignedTo);

      if (!assignedUser) {
        return res.status(404).json({
          success: false,
          message: "Assigned user not found",
        });
      }

      if (req.user.role === "Manager" && assignedUser.role !== "User") {
        return res.status(403).json({
          success: false,
          message: "Managers can assign tasks only to Users",
        });
      }

      if (!["User", "Manager"].includes(assignedUser.role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid assignee role",
        });
      }

      task.assignedTo = req.body.assignedTo;
    }

    if (req.body.title !== undefined) {
      task.title = req.body.title.trim();
    }

    if (req.body.description !== undefined) {
      task.description = req.body.description;
    }

    if (req.body.priority !== undefined) {
      task.priority = req.body.priority;
    }

      await task.save();

      // Get updated task with user details
      const updatedTask = await Task.findById(task._id)
        .populate("assignedTo", "name email role")
        .populate("createdBy", "name email role");

      // Socket.io notification
      const io = req.app.get("io");

      const assignedUserId = updatedTask.assignedTo._id.toString();
      const creatorUserId = updatedTask.createdBy._id.toString();

      // Notify assigned user and task creator
      io.to(assignedUserId).to(creatorUserId).emit("taskUpdated", {
        message: "Task details have been updated",
        task: updatedTask,
      });
    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE TASK STATUS
exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    if (!["Pending", "In Progress", "Completed"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task status",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!canAccessTask(task, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You cannot update this task",
      });
    }

    task.status = status;

    await task.save();

    // Populate task details
    const updatedTask = await Task.findById(task._id)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    // Socket.io notification
    const io = req.app.get("io");

    const assignedUserId = updatedTask.assignedTo._id.toString();
    const creatorUserId = updatedTask.createdBy._id.toString();

    // Notify assigned user and task creator
    io.to(assignedUserId)
      .to(creatorUserId)
      .emit("taskStatusChanged", {
        message: `Task status changed to ${status}`,
        task: updatedTask,
      });

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      task: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE TASK
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid task ID",
      });
    }

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    if (!canManageTask(task, req.user)) {
      return res.status(403).json({
        success: false,
        message: "You cannot delete this task",
      });
    }

    await task.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
