import cloudinary from "../lib/cloudinary.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SharedUser } from "../models/sharedUser.model.js";
import { Tenant } from "../models/tenant.model.js";
import { getTenantConnection } from "../utils/tenantDb.js";

const fetchCompaniesByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const sharedUsers = await SharedUser.find({ email }, 'companyName tenantId');
    if (!sharedUsers.length) {
      return res.status(404).json({ message: "No companies found for this email" });
    }

    const companies = sharedUsers.map(user => ({
      tenantId: user.tenantId,
      companyName: user.companyName,
    }));

    res.status(200).json({ companies });
  } catch (err) {
    console.error("Error fetching companies:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password, tenantId } = req.body;
    if (!email || !password || !tenantId) {
      return res.status(400).json({ error: "Email, password, and tenantId required" });
    }

    const sharedUser = await SharedUser.findOne({ email, tenantId });
    if (!sharedUser) {
      return res.status(404).json({ error: "User not found for this company" });
    }

    const isMatch = await bcrypt.compare(password, sharedUser.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const User = models.User;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found in tenant database" });
    }

    const token = jwt.sign(
      { id: user._id, tenantId, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { password: pwd, ...userWithoutPassword } = user._doc;
    return res.status(200).json({ user: userWithoutPassword, token });
  } catch (err) {
    console.error("Error during login user:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

const registerUser = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { name, username, email, password, mobile, address, role } = req.body;

    if (!name || !username || !email || !password || !mobile || !address) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const User = models.User;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      companyName: tenant.companyName,
      name,
      username,
      email,
      password: hashedPassword,
      mobile,
      address,
      role,
    });
    await user.save();

    const sharedUser = new SharedUser({
      companyName: tenant.companyName,
      tenantId,
      email,
      password: hashedPassword,
    });
    await sharedUser.save();

    res.status(201).json({ user, message: "Customer registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err.message);
    res.status(400).json({ error: err.message, message: "Registration failed" });
  }
};

const createUser = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const {
      name,
      username,
      department,
      postname,
      email,
      password,
      salary,
      dateofjoining,
      dateofleaving,
      mobile,
      address,
      role,
    } = req.body;

    const validRoles = ["Admin", "Manager", "Employee"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const companyName = tenant.companyName ;
    const companyLogo = tenant.companyLogo ;

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const User = models.User;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Email or username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    let imageUrl = null;
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "profile_pictures" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      imageUrl = uploadResult.secure_url;
    }

    const newUser = new User({
      companyName,
      companyLogo,
      tenantId,
      name,
      username,
      department,
      postname,
      email,
      salary,
      dateofjoining,
      dateofleaving,
      password: hashedPassword,
      mobile,
      address,
      role,
      status: "Active",
      image: imageUrl,
    });

    await newUser.save();

    const sharedUser = new SharedUser({
      companyName: tenant.companyName,
      tenantId,
      email,
      password: hashedPassword,
    });
    await sharedUser.save();

    res.status(201).json({ message: `${role} created successfully`, user: newUser });
  } catch (err) {
    console.log(err)
    res.status(500).json({ error: err.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const tenant = await Tenant.findById(tenantId);
    
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const User = models.User;

    const user = await User.findById(
      id,
      "name email department salary dateofjoining dateofleaving postname role mobile address username image status"
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const User = models.User;

    const users = await User.find(
      {},
      "companyName name email department salary dateofjoining dateofleaving postname role mobile address username image status"
    );
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMuteUsers = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const User = models.User;

    const users = await User.find(
      { status: "Mute" },
      "companyName name email department postname role mobile address username image status"
    );
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;
    const { role } = req.body;

    const validRoles = ["Admin", "Manager", "Employee", "Inactive"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role specified" });
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const User = models.User;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user._id.toString() === req.user.id) {
      return res.status(403).json({ error: "You cannot change your own role" });
    }

    user.role = role;
    await user.save();
    res.status(200).json({ message: "User role updated successfully", user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const User = models.User;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role === "Admin") {
      return res.status(403).json({ error: "You cannot delete an admin user" });
    }

    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;
    const {
      name,
      username,
      department,
      postname,
      email,
      mobile,
      address,
      salary,
      dateofjoining,
      dateofleaving,
      role,
      status,
    } = req.body;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const User = models.User;

    let updateData = {
      name,
      username,
      department,
      postname,
      email,
      mobile,
      address,
      salary,
      dateofjoining,
      dateofleaving,
      role,
      status,
    };

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "profile_pictures" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      updateData.image = uploadResult.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
};

const updateUserImage = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const User = models.User;

    if (!req.file) {
      return res.status(400).json({ message: "No image provided" });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "profile_pictures" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      ).end(req.file.buffer);
    });

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { image: uploadResult.secure_url },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User image updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user image", error: error.message });
  }
};

export {
  fetchCompaniesByEmail,
  loginUser,
  registerUser,
  createUser,
  getUser,
  getAllUsers,
  getMuteUsers,
  updateUserRole,
  deleteUser,
  updateUser,
  updateUserImage,
};