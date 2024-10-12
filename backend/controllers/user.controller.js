import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password} = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword});
    await user.save();
    res.status(201).json({ user ,message: 'Customer registered successfully' });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(400).json({error: err.message , message: 'Data Failed'});
  }
};

// Login User
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
    const { name, email, password, role } = req.body;

    // Ensure the role is valid and Admin is not creating a 'Customer'
    const validRoles = ['Admin', 'Manager', 'User'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }
    // Check if email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    // Create a new user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role // Admin specifies the role
    });
    await newUser.save();
    res.status(201).json({ message: `${role} created successfully`, user: newUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Get all User 
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'name email role'); 
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Ensure the role is valid
    const validRoles = ['Admin', 'Manager', 'User'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: 'Invalid role specified' });
    }

    // Find the user by ID
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Prevent Admin from downgrading their own role
    if (user.id === req.user.id) {
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

export { registerUser, loginUser , getAllUsers , updateUserRole ,createUser };