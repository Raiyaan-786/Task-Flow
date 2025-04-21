import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";
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
    const updateData = { ...req.body };

    // Remove restricted fields
    delete updateData.plan;
    delete updateData.billing;
    delete updateData.loginCredentials;

    // Find existing tenant
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // If a new image is uploaded, replace the old one on Cloudinary
    if (req.file) {
      // First upload the new image to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "tenant_images" }, // Save in a different folder than user profiles
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      // Add the new image URL to update data
      updateData.image = uploadResult.secure_url;

      // If there was an old logo, delete it from Cloudinary
      if (tenant.image) {
        try {
          // Extract public_id from the URL (Cloudinary specific)
          const publicId = tenant.companyLogo.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`tenant_images/${publicId}`);
        } catch (error) {
          console.error("Error deleting old logo:", error);
          // Continue even if deletion fails - we don't want to fail the update
        }
      }
    }

    // Update tenant data in MongoDB
    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Tenant updated successfully",
      tenant: updatedTenant
    });

  } catch (error) {
    console.error("Error updating tenant:", error);
    return res.status(500).json({ 
      message: "Server Error", 
      error: error.message 
    });
  }
};

export const updateTenantPlanDetails = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { plan, billing, loginCredentials } = req.body;

    const updateFields = {};

    if (plan) updateFields.plan = plan;
    if (billing) updateFields.billing = billing;
    if (loginCredentials) updateFields.loginCredentials = loginCredentials;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.status(200).json({
      message: "Tenant plan, billing, or login credentials updated successfully",
      tenant: updatedTenant
    });
  } catch (error) {
    console.error("Error updating tenant plan details:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};
