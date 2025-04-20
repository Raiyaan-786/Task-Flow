import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Owner } from "../models/Owner.js";

export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    const isMatch = await bcrypt.compare(password, owner.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: owner._id, role: "Owner" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({ token });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};