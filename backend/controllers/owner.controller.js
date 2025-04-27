import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Owner } from "../models/owner.model.js";
import { Tenant } from "../models/tenant.model.js";
import { TenantPayment } from "../models/tenantpayment.model.js";

export const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ email });
    if (!owner) return res.status(404).json({ error: "Owner not found" });

    if (password !== '12345678') {
      return res.status(500).json({ error: "Authorization error" });
    }

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

export const getAllClients = async (req, res) => {
    try {
      const clients = await Tenant.find();
      return res.status(200).json(clients);
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  };
  
  export const getSingleClient = async (req, res) => {
    try {
      const client = await Tenant.findById(req.params.id);
      if (!client) return res.status(404).json({ error: "Client not found" });
      return res.status(200).json(client);
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  };

  export const getAllPayments = async (req, res) => {
    try {
      const payments = await TenantPayment.find()
        .populate("tenant", "name email") // Populate tenant details (adjust fields as needed)
        .populate("plan", "name price"); // Populate plan details (adjust fields as needed);
      return res.status(200).json(payments);
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  };


  export const getTenantPayments = async (req, res) => {
    try {
      const tenantId = req.params.tenantId;
  
      if (!mongoose.Types.ObjectId.isValid(tenantId)) {
        return res.status(400).json({ error: "Invalid tenant ID" });
      }
  
      const payments = await TenantPayment.find({ tenant: tenantId })
        .populate("tenant", "name email") // Populate tenant details
        .populate("plan", "name price"); // Populate plan details
      if (!payments.length) {
        return res.status(404).json({ error: "No payments found for this tenant" });
      }
      return res.status(200).json(payments);
    } catch (err) {
      return res.status(500).json({ error: "Server error" });
    }
  };