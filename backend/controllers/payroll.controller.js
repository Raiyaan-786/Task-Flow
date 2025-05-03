// controllers/payroll.controller.js
import { Tenant } from "../models/tenant.model.js";
import { getTenantConnection } from "../utils/tenantDb.js";

const createPayroll = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware
    const {
      employee,
      basicSalary,
      houseAllowance,
      transportAllowance,
      bonus,
      canteenDeductions,
      deductions,
      netpay,
    } = req.body;

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantUser = models.User;
    const TenantPayroll = models.Payroll;

    // Validate employee exists in the tenant's database
    const existingEmployee = await TenantUser.findById(employee);
    if (!existingEmployee) {
      return res.status(400).json({ error: "Invalid employee ID: Employee does not exist" });
    }

    // Authorization check: Only Admin or Manager can create payroll records
    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      return res.status(403).json({ error: "Unauthorized: Only Admins or Managers can create payroll records" });
    }

    // Create new payroll record
    const newPayroll = new TenantPayroll({
      employee,
      basicSalary,
      houseAllowance,
      transportAllowance,
      bonus,
      canteenDeductions,
      deductions,
      netpay,
    });

    await newPayroll.save();

    res.status(201).json({
      message: "Payroll record created successfully",
      payroll: newPayroll,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPayroll = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantPayroll = models.Payroll;
    const TenantUser = models.User;

    // Authorization check: Admins and Managers can see all payrolls, employees can only see their own
    let query = {};
    if (req.user.role !== "Admin" && req.user.role !== "Manager") {
      query.employee = req.user.id; // Restrict to the logged-in employee's payroll records
    }

    const payrolls = await TenantPayroll.find(query)
      .populate({ path: "employee", select: "name email role", model: TenantUser });

    res.status(200).json({ payrolls });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createPayroll, getPayroll };