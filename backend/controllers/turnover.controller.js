// controllers/turnover.controller.js
import { Tenant } from "../models/tenant.model.js";
import { getTenantConnection } from "../utils/tenantDb.js";

const createTurnover = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware
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

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantTurnover = models.Turnover;
    const TenantCustomer = models.Customer;

    // Validate customer exists in the tenant's database
    const customerExists = await TenantCustomer.findById(customer);
    if (!customerExists) {
      return res.status(400).json({ error: "Invalid customer ID" });
    }

    // Authorization check: Only Admin or Manager can create turnovers
    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return res.status(403).json({ error: "Unauthorized: Only Admins or Managers can create turnovers" });
    }

    // Create new turnover
    const newTurnover = new TenantTurnover({
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
    const { tenantId } = req.user; // Extracted from JWT middleware
    const { id } = req.params;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantTurnover = models.Turnover;
    const TenantCustomer = models.Customer;

    const turnover = await TenantTurnover.findById(id)
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    if (!turnover) {
      return res.status(404).json({ error: 'Turnover not found' });
    }

    // Authorization check: Only Admin, Manager, or related customer can access
    if (
      req.user.role !== "Admin" &&
      req.user.role !== "Manager" &&
      turnover.customer._id.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.status(200).json(turnover);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllTurnovers = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantTurnover = models.Turnover;
    const TenantCustomer = models.Customer;

    // Authorization check: Only Admin or Manager can access all turnovers
    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return res.status(403).json({ error: "Unauthorized: Only Admins or Managers can access all turnovers" });
    }

    const turnovers = await TenantTurnover.find()
      .populate({ path: "customer", select: "customerName email mobileNo", model: TenantCustomer });

    res.status(200).json({ turnovers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateTurnover = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware
    const { id } = req.params;
    const { customer, ...updateData } = req.body;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantTurnover = models.Turnover;
    const TenantCustomer = models.Customer;

    const turnover = await TenantTurnover.findById(id);
    if (!turnover) {
      return res.status(404).json({ error: 'Turnover not found' });
    }

    // Authorization check: Only Admin or Manager can update turnovers
    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return res.status(403).json({ error: "Unauthorized: Only Admins or Managers can update turnovers" });
    }

    // Validate customer if updated
    if (customer && customer !== turnover.customer.toString()) {
      const customerExists = await TenantCustomer.findById(customer);
      if (!customerExists) {
        return res.status(400).json({ error: "Invalid customer ID" });
      }
      updateData.customer = customer;
    }

    const updatedTurnover = await TenantTurnover.findByIdAndUpdate(id, updateData, { new: true });
    res.status(200).json({ message: 'Turnover updated successfully', turnover: updatedTurnover });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteTurnover = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware
    const { id } = req.params;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantTurnover = models.Turnover;

    const turnover = await TenantTurnover.findById(id);
    if (!turnover) {
      return res.status(404).json({ error: 'Turnover not found' });
    }

    // Authorization check: Only Admin can delete turnovers
    if (req.user.role !== "Admin") {
      return res.status(403).json({ error: "Unauthorized: Only Admins can delete turnovers" });
    }

    await TenantTurnover.findByIdAndDelete(id);
    res.status(200).json({ message: 'Turnover deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createTurnover, getTurnover, getAllTurnovers, updateTurnover, deleteTurnover };