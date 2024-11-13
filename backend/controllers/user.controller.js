import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Register User (Customer registration)
const registerUser = async (req, res) => {
  try {
    const { name, username , department , postname, email, password, mobile, address ,role } = req.body;
    if (!name || !username || !email || !password || !mobile || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      username,
      department,
      postname,
      email,
      password: hashedPassword,
      mobile,
      address,
      role,
    });
    await user.save();
    res.status(201).json({ user, message: 'Customer registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(400).json({ error: err.message, message: 'Registration failed' });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    const { password: pwd, ...userWithoutPassword } = user._doc;
    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Error during login:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};
const createUser = async (req, res) => {
  try {
    const { name, username , department ,postname, email, password, mobile, address, role } = req.body;
    const validRoles = ['Admin', 'Manager', 'Employee'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
      department,
      postname,
      email,
      password: hashedPassword,
      mobile,
      address,
      role, 
      status: 'Active',
      image: null, 
    });

    await newUser.save();
    res.status(201).json({ message: `${role} created successfully`, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await User.findById(id, 'name email department postname role mobile address username image password status');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email department postname role mobile address username image password status');
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getMuteUsers = async (req, res) => {
  try {
    const users = await User.find({ status: "Mute"}, 'name email department postname role mobile address username image password status');
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;
    const validRoles = ['Admin', 'Manager', 'Employee' , 'Inactive'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user._id.toString() === req.user.id) {
      return res.status(403).json({ error: 'You cannot change your own role' });
    }
    user.role = role;
    await user.save();
    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    if (updates.role && id === req.user.id) {
      return res.status(403).json({ error: 'You cannot change your own role' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    Object.keys(updates).forEach((key) => {
      user[key] = updates[key];
    });
    await user.save();
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.role === 'Admin') {
      return res.status(403).json({ error: 'You cannot delete an admin user' });
    }
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { registerUser, loginUser, createUser,getUser, getAllUsers ,getMuteUsers, updateUserRole , deleteUser , updateUser };