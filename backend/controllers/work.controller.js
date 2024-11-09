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
    const work = await Work.findById(id)
      .populate("assignedEmployee", "name email")
      .populate("customer", "customerName email mobileNo");

    if (!work) {
      return res.status(404).json({ error: "Work not found" });
    }
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
      .populate("customer", "customerName email mobileNo");

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
    const totalWorks = await Work.find()
      .populate("assignedEmployee", "name email")
      .populate("customer", "customerName email mobileNo"); 
    res.status(200).json(totalWorks); // Send back the array of work documents
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCompletedWorks = async (req, res) => {
  try {
    const completedWorks = await Work.find({
      currentStatus: "Completed",
    }).populate("assignedEmployee", "name email")
    .populate("customer", "customerName email mobileNo");
    res.status(200).json(completedWorks); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAssignedWorks = async (req, res) => {
  try {
    const assignedWorks = await Work.find({
      currentStatus: "Assigned",
    }).populate("assignedEmployee", "name email")
    .populate("customer", "customerName email mobileNo"); 
    res.status(200).json(assignedWorks); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUnassignedWorks = async (req, res) => {
  try {
    const unassignedWorks = await Work.find({
      assignedEmployee: null,
    }).populate("assignedEmployee", "name email")
    .populate("customer", "customerName email mobileNo"); 
    res.status(200).json(unassignedWorks); 
  } catch (serr) {
    res.status(500).json({ error: err.message });
  }
};

const getHoldWorks = async (req, res) => {
  try {
    const holdWorks = await Work.find({ currentStatus: "Hold Work" }).populate("assignedEmployee", "name email")
    .populate("customer", "customerName email mobileNo"); 
    res.status(200).json(holdWorks); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getReadyForChecking = async (req, res) => {
  try {
    const holdWorks = await Work.find({ currentStatus: "Ready for Checking" }).populate("assignedEmployee", "name email")
    .populate("customer", "customerName email mobileNo"); 
    res.status(200).json(holdWorks); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getCustomerVerification = async (req, res) => {
  try {
    const holdWorks = await Work.find({ currentStatus: "Customer Verification" }).populate("assignedEmployee", "name email")
    .populate("customer", "customerName email mobileNo"); 
    res.status(200).json(holdWorks); 
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getEvcPending = async (req, res) => {
  try {
    const holdWorks = await Work.find({ currentStatus: "EVC Pending" }).populate("assignedEmployee", "name email")
    .populate("customer", "customerName email mobileNo"); // Fetch works with hold status
    res.status(200).json(holdWorks); // Send back the array of hold work documents
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCancelledWorks = async (req, res) => {
  try {
    const canceledWorks = await Work.find({
      currentStatus: "Cancel",
    }).populate("assignedEmployee", "name email")
    .populate("customer", "customerName email mobileNo"); 
    res.status(200).json(canceledWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const getMutedWorks = async (req, res) => {
  try {
    const mutedWorks = await Work.find({
      currentStatus: "Mute",
    }).populate("assignedEmployee", "name email")
    .populate("customer", "customerName email mobileNo"); 
    res.status(200).json(mutedWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updateWorkStatus = async (req, res) => {
  const { workId } = req.params;
  const { newStatus } = req.body;
  const validStatuses = [
    "Assigned",
    "Picked Up",
    "Customer Verification",
    "Ready for Checking",
    "Hold Work",
    "EVC Pending",
    "Cancel",
    "Completed",
    "Mute"
  ];
  if (!validStatuses.includes(newStatus)) {
    return res.status(400).json({ error: "Invalid status value" });
  }
  try {
    const work = await Work.findById(workId);
    
    if (!work) {
      return res.status(404).json({ error: "Work not found" });
    }
    work.currentStatus = newStatus;
    await work.save();
    return res.status(200).json({ message: "Work status updated successfully", work });
  } catch (error) {
    console.error("Error updating work status:", error);
    return res.status(500).json({ error: "Failed to update work status" });
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
  getCancelledWorks,
  getCustomerVerification,
  getEvcPending,
  getReadyForChecking,
  getMutedWorks,
  updateWorkStatus
};
