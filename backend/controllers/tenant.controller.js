import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Tenant } from "../models/tenant.model.js";

export const registerTenant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingTenant = await Tenant.findOne({ email });
    if (existingTenant) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTenant = new Tenant({
      email,
      password: hashedPassword,
    });
    await newTenant.save();

    return res.status(201).json({newTenant, message: "Tenant registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const loginTenant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tenant = await Tenant.findOne({ email });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const isMatch = await bcrypt.compare(password, tenant.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: tenant._id, tenantId: tenant._id, role: "Tenant", subscriptionPlan: tenant.subscriptionPlan },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({tenant, token });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const updateTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const updateData = req.body;

    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.status(200).json({
      message: "Tenant updated successfully",
      tenant: updatedTenant
    });
  } catch (error) {
    console.error("Error updating tenant:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};
