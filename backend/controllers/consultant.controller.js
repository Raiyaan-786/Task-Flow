// controllers/consultant.controller.js
import cloudinary from "../lib/cloudinary.js";
import { Tenant } from "../models/tenant.model.js";
import { getTenantConnection } from "../utils/tenantDb.js";

const createConsultant = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware
    const {
      consultantName,
      email,
      mobile,
      address,
      username,
      bankAccountNumber,
      bankIFSCCode,
      accountHolderName,
    } = req.body;

    // Validate required fields
    if (!consultantName || !email || !mobile || !username) {
      return res.status(400).json({ error: "consultantName, email, mobile, and username are required" });
    }

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantConsultant = models.Consultant;

    // Check for existing email or username to avoid duplicates within the tenant
    const existingConsultant = await TenantConsultant.findOne({ $or: [{ email }, { username }] });
    if (existingConsultant) {
      return res.status(400).json({ error: "Email or username already exists for this tenant" });
    }

    let signatureUrl = null;
    // Handle signature upload to Cloudinary if provided
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "consultant_signatures" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      signatureUrl = uploadResult.secure_url;
    }

    // Create the new Consultant in the tenant-specific database
    const newConsultant = new TenantConsultant({
      consultantName,
      email,
      mobile,
      address,
      username,
      bankAccountNumber,
      bankIFSCCode,
      accountHolderName,
      signature: signatureUrl, // Store the Cloudinary URL
    });

    await newConsultant.save();
    res.status(201).json({ message: "Consultant created successfully", consultant: newConsultant });
  } catch (err) {
    console.error("Error creating consultant:", err);
    res.status(400).json({ error: err.message });
  }
};

const getConsultant = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantConsultant = models.Consultant;

    const consultant = await TenantConsultant.findById(id);
    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    res.status(200).json(consultant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllConsultants = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantConsultant = models.Consultant;

    const consultants = await TenantConsultant.find();
    res.status(200).json({ consultants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMuteConsultant = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantConsultant = models.Consultant;

    const consultants = await TenantConsultant.find({ status: "Mute" });
    res.status(200).json({ consultants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateConsultant = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;
    const {
      consultantName,
      email,
      mobile,
      address,
      username,
      bankAccountNumber,
      bankIFSCCode,
      accountHolderName,
      status,
    } = req.body;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantConsultant = models.Consultant;

    const consultant = await TenantConsultant.findById(id);
    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    // Check for email or username conflicts if updated
    if (email && email !== consultant.email) {
      const existingEmail = await TenantConsultant.findOne({ email, _id: { $ne: id } });
      if (existingEmail) {
        return res.status(400).json({ error: "Email already in use for this tenant" });
      }
    }
    if (username && username !== consultant.username) {
      const existingUsername = await TenantConsultant.findOne({ username, _id: { $ne: id } });
      if (existingUsername) {
        return res.status(400).json({ error: "Username already in use for this tenant" });
      }
    }

    // Prepare update data
    let updateData = {
      consultantName,
      email,
      mobile,
      address,
      username,
      bankAccountNumber,
      bankIFSCCode,
      accountHolderName,
      status,
    };

    // Handle signature update if provided
    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "consultant_signatures" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      updateData.signature = uploadResult.secure_url;
    }

    const updatedConsultant = await TenantConsultant.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedConsultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    res.status(200).json({ message: "Consultant updated successfully", consultant: updatedConsultant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteConsultant = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantConsultant = models.Consultant;

    const consultant = await TenantConsultant.findByIdAndDelete(id);
    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    res.status(200).json({ message: "Consultant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  createConsultant,
  getConsultant,
  getAllConsultants,
  updateConsultant,
  deleteConsultant,
  getMuteConsultant,
};