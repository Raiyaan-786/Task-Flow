const Task = require('../models/Task');

// Create Task (Only Admin and Manager can create)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = new Task({ title, description, assignedTo, createdBy: req.user.id });
    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get All Tasks (Admin can view all tasks, Manager can view own and assigned tasks)
exports.getAllTasks = async (req, res) => {
  try {
    const role = req.user.role;
    let tasks;
    
    if (role === 'Admin') {
      tasks = await Task.find().populate('assignedTo');
    } else if (role === 'Manager') {
      tasks = await Task.find({ $or: [{ createdBy: req.user.id }, { assignedTo: req.user.id }] }).populate('assignedTo');
    } else {
      tasks = await Task.find({ assignedTo: req.user.id }).populate('assignedTo');
    }
    
    res.status(200).json({ tasks });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Update Task (Only Admin and Manager)
exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (req.user.role !== 'Admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ message: 'Task updated', updatedTask });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};