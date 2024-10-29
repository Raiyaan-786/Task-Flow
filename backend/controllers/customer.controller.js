import { Customer, CustomerGroup } from "../models/customer.model.js";


const createCustomer = async (req, res) => {
    try {
      const {
        customerName, customerCode, billingName, companyName, email, mobileNo,
        whatsappNo, sameAsMobileNo, PAN, address, contactPerson
      } = req.body;
  
      const newCustomer = new Customer({
        customerName,
        customerCode,
        billingName,
        companyName,
        email,
        mobileNo,
        whatsappNo: sameAsMobileNo ? mobileNo : whatsappNo, 
        sameAsMobileNo,
        PAN,
        address,
        contactPerson,
      });
  
      await newCustomer.save();
      res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
};

const getCustomer = async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findById(id);
  
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      res.status(200).json(customer);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const getAllCustomers = async (req, res) => {
    try {
      const customers = await Customer.find();
      res.status(200).json({customers});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const updateCustomer = async (req, res) => {
    try {
      const { id } = req.params;
      const updatedCustomer = await Customer.findByIdAndUpdate(id, req.body, { new: true });
  
      if (!updatedCustomer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

const deleteCustomer = async (req, res) => {
    try {
      const { id } = req.params;
      const customer = await Customer.findByIdAndDelete(id);
  
      if (!customer) {
        return res.status(404).json({ error: 'Customer not found' });
      }
  
      res.status(200).json({ message: 'Customer deleted successfully' });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};

// Create a new group with customers (if provided)
const createGroup = async (req, res) => {
  try {
    // Log the incoming request body
    console.log("Request Body:", req.body);

    const { groupName, customerIds } = req.body;

    if (!groupName) {
      return res.status(400).json({ error: "Group name is required." });
    }

    // Fetch the customers based on provided IDs
    const customers = customerIds
      ? await Customer.find({ _id: { $in: customerIds } })
      : [];

    // Create a new customer group
    const newGroup = new CustomerGroup({
      groupName,
      customers: customers.map(customer => customer._id),
    });

    // Save the group to the database
    await newGroup.save();
    res.status(201).json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    console.error("Error creating group:", error); // Log the error for debugging
    res.status(500).json({ error: "An error occurred while creating the group." });
  }
};


// Add a customer to an existing group
const addCustomerToGroup = async (req, res) => {
  try {
    const { groupId, customerId } = req.body;

    // Find the group by ID
    const group = await CustomerGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    // Check if customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }

    // Check if customer is already in the group
    if (group.customers.includes(customerId)) {
      return res.status(400).json({ error: "Customer is already in the group." });
    }

    // Add customer to the group and save
    group.customers.push(customerId);
    await group.save();

    res.status(200).json({ message: "Customer added to group successfully", group });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while adding the customer to the group." });
  }
};

const removeCustomerFromGroup = async (req, res) => {
  try {
    const { groupId, customerId } = req.body;

    // Find the group by ID
    const group = await CustomerGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    // Check if customer is in the group
    const customerIndex = group.customers.indexOf(customerId);
    if (customerIndex === -1) {
      return res.status(400).json({ error: "Customer is not in the group." });
    }

    // Remove customer from the group and save
    group.customers.splice(customerIndex, 1);
    await group.save();

    res.status(200).json({ message: "Customer removed from group successfully", group });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while removing the customer from the group." });
  }
};

const getAllGroups = async (req, res) => {
  try {
    const groups = await CustomerGroup.find().populate("customers"); 
    res.status(200).json({ message: "Groups retrieved successfully", groups });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving the groups." });
  }
};

const getSingleGroup = async (req, res) => {
  try {
    const { id } = req.params; // Use id instead of groupId

    const group = await CustomerGroup.findById(id).populate("customers");
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }

    res.status(200).json({ message: "Group retrieved successfully", group });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving the group." });
  }
};

export {createCustomer ,getCustomer , getAllCustomers , updateCustomer , deleteCustomer , createGroup , addCustomerToGroup , removeCustomerFromGroup , getAllGroups , getSingleGroup}