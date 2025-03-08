import asyncHandler from "express-async-handler";
import TaskModel from "../../models/task/TaskModel.js";

export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!description || description.trim === "") {
      return res.status(400).json({ message: "Description is Required" });
    }

    const task = new TaskModel({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user._id,
    });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.log("Error in Creating Task", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    if (!userId) {
      return res.status(400).json({ message: "User Not Found." });
    }
    const tasks = await TaskModel.find({ user: userId });
    res.status(201).json({ length: tasks.length, tasks });
  } catch (error) {
    console.log("Error in Get Tasks", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Please provide a Task Id" });
    }
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(400).json({ message: "Task not Found" });
    }
    if (!task.user.equals(userId)) {
      return res.status(400).json({ message: "Not Authorized to View Task" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.log("Error in Get Tasks", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, description, dueDate, priority, status, completed } =
      req.body;
    if (!id) {
      return res.status(400).json({ message: "Please provide a Task Id" });
    }
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(400).json({ message: "Task not Found" });
    }
    if (!task.user.equals(userId)) {
      return res.status(400).json({ message: "Not Authorized to Update Task" });
    }

    //update if provided
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.completed = completed || task.completed;
    await task.save();
    res.status(200).json(task);
  } catch (error) {
    console.log("Error in Get Tasks", error.message);
    res.status(500).json({ message: error.message });
  }
});

export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: "Please provide a Task Id" });
    }
    const task = await TaskModel.findById(id);
    if (!task) {
      return res.status(400).json({ message: "Task not Found" });
    }
    if (!task.user.equals(userId)) {
      return res.status(400).json({ message: "Not Authorized to Delete Task" });
    }
    await TaskModel.findByIdAndDelete(id);
    return res.status(200).json({ message: "Task Deleted Successfully" });
  } catch (error) {
    console.log("Error in Get Tasks", error.message);
    res.status(500).json({ message: error.message });
  }
});
