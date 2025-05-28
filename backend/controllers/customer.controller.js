// controllers/customer.controller.js
import mongoose from "mongoose";
import cloudinary from "../lib/cloudinary.js";
import bcrypt from "bcrypt";
import { SharedCustomer } from "../models/sharedCustomer.model.js";
import { Tenant } from "../models/tenant.model.js";
import { getTenantConnection } from "../utils/tenantDb.js";

const fetchCompaniesByEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }

    const sharedCustomers = await SharedCustomer.find(
      { email },
      "companyName tenantId"
    );
    if (!sharedCustomers.length) {
      return res
        .status(404)
        .json({ message: "No companies found for this email" });
    }

    const companies = sharedCustomers.map((user) => ({
      tenantId: user.tenantId,
      companyName: user.companyName,
    }));

    res.status(200).json({ companies });
  } catch (err) {
    console.error("Error fetching companies:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

const loginCustomer = async (req, res) => {
  try {
    const { email, password, tenantId } = req.body;
    if (!email || !password || !tenantId) {
      return res
        .status(400)
        .json({ error: "Email, password, and tenantId required" });
    }

    const sharedCustomer = await SharedCustomer.findOne({ email, tenantId });
    if (!sharedCustomer) {
      return res
        .status(404)
        .json({ error: "Customer not found for this company" });
    }

    const isMatch = await bcrypt.compare(password, sharedCustomer.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res
        .status(404)
        .json({ error: "Customer not found in tenant database" });
    }

    const customertoken = jwt.sign(
      { id: customer._id, tenantId },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    const { password: pwd, ...userWithoutPassword } = customer._doc;
    return res.status(200).json({ user: userWithoutPassword, customertoken });
  } catch (err) {
    console.error("Error during login customer:", err.message);
    return res.status(500).json({ error: "Server error" });
  }
};

const createCustomer = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const {
      customerName,
      customerCode,
      password,
      billingName,
      email,
      mobileNo,
      whatsappNo,
      sameAsMobileNo,
      PAN,
      AadharNo,
      address,
      contactPersonName,
      contactPersonPhone,
      groupName,
    } = req.body;

    if (
      !customerName ||
      !customerCode ||
      !password ||
      !billingName ||
      !email ||
      !mobileNo ||
      !tenantId
    ) {
      return res.status(400).json({
        error:
          "companyName, customerName, customerCode, password, billingName, email, mobileNo, and tenantId are required",
      });
    }

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const companyName = tenant.companyName;

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;
    const CustomerGroup = models.CustomerGroup;

    // Check if email already exists in SharedCustomer (for login)
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: "Email already exist" });
    }

    // Check if mobileNo already exists in Customer (tenant-specific)
    const existingCustomerByMobile = await Customer.findOne({ mobileNo });
    if (existingCustomerByMobile) {
      return res
        .status(400)
        .json({ error: "Mobile number already in use for this tenant" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Create SharedCustomer for login
    const sharedCustomer = new SharedCustomer({
      companyName: tenant.companyName,
      tenantId,
      email,
      password: hashedPassword,
    });
    await sharedCustomer.save();

    // Handle group if provided
    let group = null;
    if (groupName) {
      group = await CustomerGroup.findById(groupName);
      if (!group) {
        return res
          .status(400)
          .json({ error: "Invalid groupName: Group does not exist" });
      }
    }

    // Create tenant-specific Customer
    const newCustomer = new Customer({
      companyName,
      tenantId,
      customerName,
      customerCode,
      password: hashedPassword,
      billingName,
      email,
      mobileNo,
      whatsappNo: sameAsMobileNo ? mobileNo : whatsappNo,
      sameAsMobileNo,
      PAN,
      AadharNo,
      address,
      contactPersonName,
      contactPersonPhone,
      groupName: group ? group._id : null,
    });

    await newCustomer.save();

    // Update group if applicable
    if (group) {
      group.customers.push(newCustomer._id);
      await group.save();
    }

    res.status(201).json({
      message: "Customer created successfully",
      customer: newCustomer,
      sharedCustomer: { id: sharedCustomer._id, email: sharedCustomer.email },
    });
  } catch (err) {
    console.error("Error creating customer:", err);
    if (err.code === 11000) {
      const field = Object.keys(err.keyValue)[0];
      return res
        .status(400)
        .json({ error: `${field} '${err.keyValue[field]}' is already in use` });
    }
    res.status(400).json({ error: err.message });
  }
};

const getCustomer = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;

    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    res.status(200).json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllCustomers = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;

    const customers = await Customer.find();
    res.status(200).json({ customers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUnassignedCustomers = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;

    const unassignedCustomers = await Customer.find({ groupName: null });
    res.status(200).json({ unassignedCustomers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateCustomer = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;
    const {
      customerName,
      mobileNo,
      whatsappNo,
      contactPersonName,
      contactPersonPhone,
      status
    } = req.body;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;

    let updateData = {
      customerName,
      mobileNo,
      whatsappNo,
      contactPersonName,
      contactPersonPhone,
      status
    };

    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: "customer_pictures" }, (error, result) => {
            if (error) reject(error);
            else resolve(result);
          })
          .end(req.file.buffer);
      });
      updateData.image = uploadResult.secure_url;
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    
    if (!updatedCustomer) {
      return res.status(404).json({ error: "Customer not found" });
    }    
    res.status(200).json({
      message: "Customer updated successfully",
      customer: updatedCustomer,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const { tenantId } = req.user;
    const { id } = req.params;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;
    const CustomerGroup = models.CustomerGroup;
    
    const customer = await Customer.findById(id);

    if (!customer) {
      return res.status(404).json({ error: "Customer not found" });
    }

    // Remove from SharedCustomer
    await SharedCustomer.deleteOne({ email: customer.email });

    // Remove from any groups
    if (customer.groupName) {
      const group = await CustomerGroup.findById(customer.groupName);
      if (group) {
        group.customers = group.customers.filter(
          (custId) => custId.toString() !== id
        );
        await group.save();
      }
    }

    // Delete the customer
    await Customer.findByIdAndDelete(id);

    res.status(200).json({ message: "Customer deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUniqueFirmNames = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;

    const firmNames = await Customer.distinct("customerCompanyName");
    res.status(200).json({
      success: true,
      firmNames,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve unique firm names",
    });
  }
};

const getPAN = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;

    const pans = await Customer.distinct("PAN");
    res.status(200).json({
      success: true,
      pans,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve Pan Numbers",
    });
  }
};

const createGroup = async (req, res) => {
  try {
    const { groupName, customerIds, groupAdmin } = req.body;
    if (!groupName) {
      return res.status(400).json({ error: "Group name is required." });
    }
    if (!groupAdmin) {
      return res.status(400).json({ error: "Group admin is required." });
    }

    const { tenantId } = req.user;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;
    const CustomerGroup = models.CustomerGroup;

    const admin = await Customer.findById(groupAdmin);
    if (!admin) {
      return res
        .status(400)
        .json({ error: "Invalid group admin: Customer does not exist." });
    }

    const customers = customerIds
      ? await Customer.find({ _id: { $in: customerIds } })
      : [];
    const adminInCustomers = customers.some(
      (customer) => customer._id.toString() === groupAdmin
    );
    if (!adminInCustomers) {
      return res
        .status(400)
        .json({ error: "Group admin must be included in the customers list." });
    }
    const newGroup = new CustomerGroup({
      groupName,
      customers: customers.map((customer) => customer._id),
      groupAdmin,
    });
    const savedGroup = await newGroup.save();
    await Customer.updateMany(
      { _id: { $in: customerIds } },
      { groupName: savedGroup._id }
    );

    res.status(201).json({
      message: "Group created successfully",
      group: savedGroup,
    });
  } catch (error) {
    console.error("Error creating group:", error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the group." });
  }
};

const addCustomerToGroup = async (req, res) => {
  try {
    const { groupId, customerId } = req.body;
    const { tenantId } = req.user;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;
    const CustomerGroup = models.CustomerGroup;

    const group = await CustomerGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }
    if (group.customers.includes(customerId)) {
      return res
        .status(400)
        .json({ error: "Customer is already in the group." });
    }
    group.customers.push(customerId);
    await group.save();
    customer.groupName = groupId;
    await customer.save();
    res
      .status(200)
      .json({ message: "Customer added to group successfully", group });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while adding the customer to the group.",
    });
  }
};

const removeCustomerFromGroup = async (req, res) => {
  try {
    const { groupId, customerId } = req.body;
    const { tenantId } = req.user;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;
    const CustomerGroup = models.CustomerGroup;

    const group = await CustomerGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    const customerIndex = group.customers.indexOf(customerId);
    if (customerIndex === -1) {
      return res.status(400).json({ error: "Customer is not in the group." });
    }
    group.customers.splice(customerIndex, 1);
    await group.save();
    const customer = await Customer.findById(customerId);
    if (customer) {
      customer.groupName = null;
      await customer.save();
    }
    res
      .status(200)
      .json({ message: "Customer removed from group successfully", group });
  } catch (error) {
    res.status(500).json({
      error: "An error occurred while removing the customer from the group.",
    });
  }
};

const updateGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { groupName, groupAdmin, customerIds } = req.body;
    const { tenantId } = req.user;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const Customer = models.Customer;
    const CustomerGroup = models.CustomerGroup;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid group ID format." });
    }
    if (!groupName) {
      return res.status(400).json({ error: "Group name is required." });
    }

    if (groupAdmin) {
      if (!mongoose.Types.ObjectId.isValid(groupAdmin)) {
        return res
          .status(400)
          .json({ error: "Invalid group admin ID format." });
      }
      const adminExists = await Customer.findById(groupAdmin);
      if (!adminExists) {
        return res.status(400).json({ error: "Group admin does not exist." });
      }
    }

    const group = await CustomerGroup.findById(id);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    if (!Array.isArray(customerIds)) {
      return res.status(400).json({ error: "Invalid customers list." });
    }
    const validCustomers = await Customer.find({ _id: { $in: customerIds } });
    if (validCustomers.length !== customerIds.length) {
      return res.status(400).json({ error: "Some customers do not exist." });
    }

    group.groupName = groupName;
    if (groupAdmin) group.groupAdmin = groupAdmin;
    group.customers = customerIds;
    await group.save();

    await Customer.updateMany({ _id: { $in: customerIds } }, { groupName: id });

    res.status(200).json({
      message: "Group updated successfully",
      group,
    });
  } catch (error) {
    console.error("Error updating group:", error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the group." });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const { tenantId } = req.user;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const CustomerGroup = models.CustomerGroup;

    const groups = await CustomerGroup.find().populate("customers");
    res.status(200).json({ message: "Groups retrieved successfully", groups });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the groups." });
  }
};

const getSingleGroup = async (req, res) => {
  try {
    const { id } = req.params;

    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const CustomerGroup = models.CustomerGroup;

    const group = await CustomerGroup.findById(id).populate("customers");
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    res.status(200).json({ message: "Group retrieved successfully", group });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the group." });
  }
};

const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const CustomerGroup = models.CustomerGroup;
    const Customer = models.Customer;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid group ID format." });
    }
    const group = await CustomerGroup.findByIdAndDelete(id);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    await Customer.updateMany({ groupName: id }, { $set: { groupName: null } });
    res.status(200).json({
      message: "Group deleted successfully, customers' groupName updated.",
    });
  } catch (error) {
    console.error("Error deleting group:", error);
    res
      .status(500)
      .json({ error: "An error occurred while deleting the group." });
  }
};

export {
  createCustomer,
  getCustomer,
  getAllCustomers,
  updateCustomer,
  deleteCustomer,
  createGroup,
  addCustomerToGroup,
  removeCustomerFromGroup,
  getAllGroups,
  getSingleGroup,
  deleteGroup,
  updateGroup,
  getUniqueFirmNames,
  getPAN,
  getAllUnassignedCustomers,
};
