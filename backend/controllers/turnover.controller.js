import { Turnover } from "../models/turnover.model.js";

const createTurnover = async (req, res) => {
  try {
    const {
      customer,
      companyName,
      name,
      code,
      pan,
      address,
      types,
      financialYear,
      turnover,
      status,
    } = req.body;

    const newTurnover = new Turnover({
      customer,
      companyName,
      name,
      code,
      pan,
      address,
      types,
      financialYear,
      turnover,
      status,
    });

    await newTurnover.save();
    res.status(201).json({ message: 'Turnover created successfully', turnover: newTurnover });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTurnover = async (req, res) => {
  try {
    const { id } = req.params;
    const turnover = await Turnover.findById(id).populate('customer');

    if (!turnover) {
      return res.status(404).json({ error: 'Turnover not found' });
    }

    res.status(200).json(turnover);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllTurnovers = async (req, res) => {
  try {
    const turnovers = await Turnover.find().populate('customer');
    res.status(200).json({ turnovers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTurnover = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTurnover = await Turnover.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedTurnover) {
      return res.status(404).json({ error: 'Turnover not found' });
    }

    res.status(200).json({ message: 'Turnover updated successfully', turnover: updatedTurnover });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTurnover = async (req, res) => {
  try {
    const { id } = req.params;
    const turnover = await Turnover.findByIdAndDelete(id);

    if (!turnover) {
      return res.status(404).json({ error: 'Turnover not found' });
    }

    res.status(200).json({ message: 'Turnover deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createTurnover, getTurnover, getAllTurnovers, updateTurnover, deleteTurnover };
