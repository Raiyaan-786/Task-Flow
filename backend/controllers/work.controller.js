import { Work } from "../models/work.model.js";
import { User } from "../models/user.model.js";

const addWork = async (req, res) => {
  try {
    const {
      customer,
      billingName,
      email,
      mobile,
      pan,
      address,
      service,
      workType,
      assignedEmployee,
      month,
      quarter,
      financialYear,
      price,
      quantity,
      discount,
      currentStatus = "Assigned",
      reminder = null, // Default to null if not provided
      remark = "", // Default to an empty string if not provided
    } = req.body;

    const employeeExists = await User.findById(assignedEmployee);
    if (
      !employeeExists ||
      (employeeExists.role !== "Manager" && employeeExists.role !== "Employee")
    ) {
      return res
        .status(400)
        .json({ error: "Invalid employee ID for assignment" });
    }

    const newWork = new Work({
      customer,
      billingName,
      email,
      mobile,
      pan,
      address,
      service,
      workType,
      assignedEmployee,
      month,
      quarter,
      financialYear,
      price,
      quantity,
      discount,
      currentStatus,
      reminder,
      remark,
    });
    await newWork.save();
    res
      .status(201)
      .json({ message: "Work created successfully", work: newWork });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getWork = async (req, res) => {
  try {
    const { id } = req.params;
    // Find work by ID and populate the assigned employee and customer fields
    const work = await Work.findById(id)
      .populate("assignedEmployee", "name email")
      .populate("customer", "customerName email");

    if (!work) {
      return res.status(404).json({ error: "Work not found" });
    }

    // Only allow Admins, Managers, the assigned Employee, or the Customer to view the work
    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Manager" &&
      req.user.id !== work.assignedEmployee.toString() &&
      req.user.id !== work.customer.toString()
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.status(200).json({ work });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllWork = async (req, res) => {
  try {
    const works = await Work.find()
      .populate("assignedEmployee", "name email")
      .populate("customer", "customerName email");

    res.status(200).json({ works });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateWork = async (req, res) => {
  try {
    const { id } = req.params;
    const work = await Work.findById(id);

    if (!work) return res.status(404).json({ error: "Work not found" });
    if (
      req.user.role !== "Admin" &&
      work.assignedEmployee.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const updatedWork = await Work.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({ message: "Work updated", updatedWork });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteWork = async (req, res) => {
  try {
    const { id } = req.params;
    const work = await Work.findById(id);

    if (!work) return res.status(404).json({ error: "Work not found" });
    if (
      req.user.role !== "Admin" &&
      work.assignedEmployee.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await Work.findByIdAndDelete(id);
    res.status(200).json({ message: "Work deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTotalWorks = async (req, res) => {
  try {
    const totalWorks = await Work.find(); // Fetch all works
    res.status(200).json(totalWorks); // Send back the array of work documents
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCompletedWorks = async (req, res) => {
  try {
    const completedWorks = await Work.find({
      currentStatus: "Completed",
    }); // Fetch works with completed status
    res.status(200).json(completedWorks); // Send back the array of completed work documents
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAssignedWorks = async (req, res) => {
  try {
    const assignedWorks = await Work.find({
      currentStatus: "Assigned",
    }); // Fetch works with assigned status
    res.status(200).json(assignedWorks); // Send back the array of assigned work documents
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUnassignedWorks = async (req, res) => {
  try {
    const unassignedWorks = await Work.find({
      assignedEmployee: null,
    }); // Fetch works that are unassigned
    res.status(200).json(unassignedWorks); // Send back the array of unassigned work documents
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHoldWorks = async (req, res) => {
  try {
    const holdWorks = await Work.find({ currentStatus: "Hold Work" }); // Fetch works with hold status
    res.status(200).json(holdWorks); // Send back the array of hold work documents
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCanceledWorks = async (req, res) => {
  try {
    const canceledWorks = await Work.find({
      currentStatus: "Cancel",
    }); 
    res.status(200).json(canceledWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export {
  addWork,
  getWork,
  getAllWork,
  updateWork,
  deleteWork,
  getTotalWorks,
  getCompletedWorks,
  getAssignedWorks,
  getUnassignedWorks,
  getHoldWorks,
  getCanceledWorks,
};
