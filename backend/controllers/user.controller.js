import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// Register User (Customer registration)
const registerUser = async (req, res) => {
  try {
    const { name, username, email, password, mobile, address ,role } = req.body;

    // Validate required fields
    if (!name || !username || !email || !password || !mobile || !address) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email or username already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new customer
    const user = new User({
      name,
      username,
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

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return user without the password
    const { password: pwd, ...userWithoutPassword } = user._doc;
    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error('Error during login:', err.message);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
};

// Admin/Manager creating a user
const createUser = async (req, res) => {
  try {
    const { name, username, email, password, mobile, address, role } = req.body;

    // Validate the role
    const validRoles = ['Admin', 'Manager', 'Employee'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Email or username already exists' });
    }

    // Create a new user with image as empty (null or undefined)
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      username,
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
// Get single User
const getUser = async (req, res) => {
  try {
    const { id } = req.params; // Extract the user ID from the request params

    // Find the user by ID, including the image and password fields
    const user = await User.findById(id, 'name email role mobile address username image password status');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get all Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role mobile address username image password status');
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update User Role
const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Ensure the role is valid
    const validRoles = ['Admin', 'Manager', 'Employee' , 'Inactive'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent Admin from downgrading their own role
    if (user._id.toString() === req.user.id) {
      return res.status(403).json({ error: 'You cannot change your own role' });
    }

    // Update the user's role
    user.role = role;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent deletion of admin user (optional, based on your requirements)
    if (user.role === 'Admin') {
      return res.status(403).json({ error: 'You cannot delete an admin user' });
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export { registerUser, loginUser, createUser,getUser, getAllUsers, updateUserRole , deleteUser };