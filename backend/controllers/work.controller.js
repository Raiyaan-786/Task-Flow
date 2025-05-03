// controllers/work.controller.js
import { Tenant } from "../models/tenant.model.js";
import { getTenantConnection } from "../utils/tenantDb.js";

const addWork = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware
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
      reminder = null,
      remark = "",
      paymentStatus = "Pending",
      balancePayment,
    } = req.body;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    // Validate customer exists in the tenant's database
    const customerExists = await TenantCustomer.findById(customer);
    if (!customerExists) {
      return res.status(400).json({ error: "Invalid customer ID" });
    }

    // Validate assignedEmployee if provided
    if (assignedEmployee) {
      const employeeExists = await TenantUser.findById(assignedEmployee);
      if (
        !employeeExists ||
        (employeeExists.role !== "Manager" && employeeExists.role !== "Employee")
      ) {
        return res.status(400).json({ error: "Invalid employee ID for assignment" });
      }
    }

    // Create new work in the tenant-specific database
    const newWork = new TenantWork({
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
      paymentStatus,
      balancePayment,
    });

    await newWork.save();
    res.status(201).json({ message: "Work created successfully", work: newWork });
  } catch (err) {
    console.error("Error creating work:", err);
    res.status(500).json({ error: err.message });
  }
};

const getWork = async (req, res) => {
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
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const work = await TenantWork.findById(id)
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    if (!work) {
      return res.status(404).json({ error: "Work not found" });
    }

    // Authorization check
    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Manager" &&
      req.user.id !== work.assignedEmployee?.toString() &&
      req.user.id !== work.customer?.toString()
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
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const works = await TenantWork.find()
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json({ works });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateWork = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;
    const { assignedEmployee, customer, ...updateData } = req.body;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const work = await TenantWork.findById(id);
    if (!work) {
      return res.status(404).json({ error: "Work not found" });
    }

    // Authorization check
    if (
      req.user.role !== "Admin" &&
      work.assignedEmployee?.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Validate customer if updated
    if (customer && customer !== work.customer.toString()) {
      const customerExists = await TenantCustomer.findById(customer);
      if (!customerExists) {
        return res.status(400).json({ error: "Invalid customer ID" });
      }
      updateData.customer = customer;
    }

    // Validate assignedEmployee if updated
    if (assignedEmployee && assignedEmployee !== work.assignedEmployee?.toString()) {
      const employeeExists = await TenantUser.findById(assignedEmployee);
      if (
        !employeeExists ||
        (employeeExists.role !== "Manager" && employeeExists.role !== "Employee")
      ) {
        return res.status(400).json({ error: "Invalid employee ID for assignment" });
      }
      updateData.assignedEmployee = assignedEmployee;
    }

    const updatedWork = await TenantWork.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: "Work updated", updatedWork });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const deleteWork = async (req, res) => {
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
    const TenantWork = models.Work;

    const work = await TenantWork.findById(id);
    if (!work) {
      return res.status(404).json({ error: "Work not found" });
    }

    // Authorization check
    if (
      req.user.role !== "Admin" &&
      work.assignedEmployee?.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    await TenantWork.findByIdAndDelete(id);
    res.status(200).json({ message: "Work deleted successfully" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getTotalWorks = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const totalWorks = await TenantWork.find()
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json(totalWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCompletedWorks = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const completedWorks = await TenantWork.find({ currentStatus: "Completed" })
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json(completedWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAssignedWorks = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const assignedWorks = await TenantWork.find({ currentStatus: "Assigned" })
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json(assignedWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUnassignedWorks = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const unassignedWorks = await TenantWork.find({ assignedEmployee: null })
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json(unassignedWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getHoldWorks = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const holdWorks = await TenantWork.find({ currentStatus: "Hold Work" })
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json(holdWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getReadyForChecking = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const readyForCheckingWorks = await TenantWork.find({ currentStatus: "Ready for Checking" })
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json(readyForCheckingWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCustomerVerification = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const customerVerificationWorks = await TenantWork.find({ currentStatus: "Customer Verification" })
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json(customerVerificationWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getEvcPending = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const evcPendingWorks = await TenantWork.find({ currentStatus: "EVC Pending" })
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json(evcPendingWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getCancelledWorks = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const canceledWorks = await TenantWork.find({ currentStatus: "Cancel" })
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json(canceledWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMutedWorks = async (req, res) => {
  try {
    const { tenantId } = req.user;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;
    const TenantUser = models.User;
    const TenantCustomer = models.Customer;

    const mutedWorks = await TenantWork.find({ currentStatus: "Mute" })
      .populate({ path: "assignedEmployee", select: "name email", model: TenantUser })
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json(mutedWorks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateWorkStatus = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;
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
      "Mute",
    ];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;

    const work = await TenantWork.findById(id);
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
  updateWorkStatus,
};