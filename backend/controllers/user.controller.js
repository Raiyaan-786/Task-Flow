import { User } from '../models/user.model.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Register User
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({ user ,message: 'User registered successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Login User
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({user , token });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export { registerUser, loginUser};