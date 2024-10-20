import { Consultant } from "../models/consultant.model.js";

const createConsultant = async (req, res) => {
  try {
    const {
      consultantName, email, mobile, address, username,
      bankAccountNumber, bankIFSCCode, accountHolderName, signature
    } = req.body;

    const newConsultant = new Consultant({
      consultantName,
      email,
      mobile,
      address,
      username,
      bankAccountNumber,
      bankIFSCCode,
      accountHolderName,
      signature,
    });

    await newConsultant.save();
    res.status(201).json({ message: 'Consultant created successfully', consultant: newConsultant });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getConsultant = async (req, res) => {
  try {
    const { id } = req.params;
    const consultant = await Consultant.findById(id);

    if (!consultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }

    res.status(200).json(consultant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllConsultants = async (req, res) => {
  try {
    const consultants = await Consultant.find();
    res.status(200).json({consultants});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateConsultant = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedConsultant = await Consultant.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedConsultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }

    res.status(200).json({ message: 'Consultant updated successfully', consultant: updatedConsultant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteConsultant = async (req, res) => {
  try {
    const { id } = req.params;
    const consultant = await Consultant.findByIdAndDelete(id);

    if (!consultant) {
      return res.status(404).json({ error: 'Consultant not found' });
    }

    res.status(200).json({ message: 'Consultant deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  createConsultant,
  getConsultant,
  getAllConsultants,
  updateConsultant,
  deleteConsultant
};