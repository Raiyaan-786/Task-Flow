import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Owner } from "../models/owner.model.js";
import { Tenant } from "../models/tenant.model.js";

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