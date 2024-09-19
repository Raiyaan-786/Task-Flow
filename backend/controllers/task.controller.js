import { Task } from '../models/task.model.js';
import { User } from '../models/user.model.js';

// Create Task (Only Admin and Manager can create)
const createTaskByAdmin = async (req, res) => {
  try {
    const { title, description, assignedTo } = req.body;
    const task = new Task({ title, description, assignedTo, createdBy: req.user.id });
    await task.save();
    res.status(201).json({ message: 'Task created successfully', task });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Create task by Customer, default assignment to Manager

const createTaskByCustomer = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Get the logged-in user (Customer)
    const customerId = req.user.id;  // Assuming JWT middleware adds user info

    // Ensure the user is a customer
    const customer = await User.findById(customerId);
    if (customer.role !== 'Customer') {
      return res.status(403).json({ error: 'Only customers can create tasks' });
    }

    // Find a manager to assign the task to
    const manager = await User.findOne({ role: 'Manager' });
    if (!manager) {
      return res.status(404).json({ error: 'No manager found to assign the task' });
    }

    // Create the task
    const task = new Task({
      title,
      description,
      createdBy: customerId,  // Task created by the customer
      assignedTo: manager._id  // Default assignment to the manager
    });

    await task.save();

    res.status(201).json({
      message: 'Task created successfully',
      task
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get All Tasks (Admin can view all tasks, Manager can view own and assigned tasks)
const getAllTasks = async (req, res) => {
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
const updateTask = async (req, res) => {
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

// Delete Task (Only Admin and Manager)
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);

    if (!task) return res.status(404).json({ error: 'Task not found' });
    if (req.user.role !== 'Admin' && task.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await Task.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { createTaskByAdmin , getAllTasks , updateTask , deleteTask , createTaskByCustomer};