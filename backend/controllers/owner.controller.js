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

    const ownertoken = jwt.sign(
      { id: owner._id, role: "Owner" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({ ownertoken });
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


  export const getSinglePayment = async (req, res) => {
    try {
      const { paymentId } = req.params;
      if (!paymentId.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(400).json({ error: 'Invalid payment ID' });
      }
  
      const payment = await TenantPayment.findById(paymentId)
        .populate('tenant', 'name email image') // Populate tenant details
        .populate('plan', 'name price'); // Populate plan details
  
      if (!payment) {
        return res.status(404).json({ error: 'Payment not found' });
      }
  
      return res.status(200).json(payment);
    } catch (err) {
      return res.status(500).json({ error: err.message || 'Server error' });
    }
  };