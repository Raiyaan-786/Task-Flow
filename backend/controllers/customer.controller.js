import mongoose from "mongoose";
import { Customer, CustomerGroup } from "../models/customer.model.js";
import { Work } from "../models/work.model.js"; 

// const createCustomer = async (req, res) => {
//     try {
//       const {
//         customerName, customerCode , password, billingName, companyName, email, mobileNo,
//         whatsappNo, sameAsMobileNo, PAN ,AadharNo , address, contactPersonName, contactPersonPhone
//       } = req.body;
  
//       const newCustomer = new Customer({
//         customerName,
//         customerCode,
//         password,
//         billingName,
//         companyName,
//         email,
//         mobileNo,
//         whatsappNo: sameAsMobileNo ? mobileNo : whatsappNo, 
//         sameAsMobileNo,
//         PAN,
//         AadharNo,
//         address,
//         contactPersonName,
//         contactPersonPhone,
        
//       });
  
//       await newCustomer.save();
//       res.status(201).json({ message: 'Customer created successfully', customer: newCustomer });
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
// };
const createCustomer = async (req, res) => {
  try {
    const {
      customerName,
      customerCode,
      password,
      billingName,
      companyName,
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
    let group = null;
    if (groupName) {
      group = await CustomerGroup.findById(groupName);
      if (!group) {
        return res.status(400).json({ error: 'Invalid groupName: Group does not exist' });
      }
    }
    const newCustomer = new Customer({
      customerName,
      customerCode,
      password,
      billingName,
      companyName,
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
    if (group) {
      group.customers.push(newCustomer._id);
      await group.save();
    }
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

const getUniqueFirmNames = async (req, res) => {
  try {
    const firmNames = await Customer.distinct("companyName");
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
    console.log("Request Body:", req.body);
    const { groupName, customerIds } = req.body;

    if (!groupName) {
      return res.status(400).json({ error: "Group name is required." });
    }
    const customers = customerIds
      ? await Customer.find({ _id: { $in: customerIds } })
      : [];
    const newGroup = new CustomerGroup({
      groupName,
      customers: customers.map(customer => customer._id),
    });
    await newGroup.save();
    res.status(201).json({ message: "Group created successfully", group: newGroup });
  } catch (error) {
    console.error("Error creating group:", error); 
    res.status(500).json({ error: "An error occurred while creating the group." });
  }
};

const addCustomerToGroup = async (req, res) => {
  try {
    const { groupId, customerId } = req.body;
    const group = await CustomerGroup.findById(groupId);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ error: "Customer not found." });
    }
    if (group.customers.includes(customerId)) {
      return res.status(400).json({ error: "Customer is already in the group." });
    }
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
    const { id } = req.params; 
    const group = await CustomerGroup.findById(id).populate("customers");
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    res.status(200).json({ message: "Group retrieved successfully", group });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while retrieving the group." });
  }
};
const deleteGroup = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid group ID format." });
    }

    const group = await CustomerGroup.findByIdAndDelete(id);

    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    res.status(200).json({ message: "Group deleted successfully." });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ error: "An error occurred while deleting the group." });
  }
};
const updateGroupName = async (req, res) => {
  try {
    const { id } = req.params; 
    const { groupName } = req.body; 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid group ID format." });
    }
    if (!groupName) {
      return res.status(400).json({ error: "Group name is required." });
    }
    const updatedGroup = await CustomerGroup.findByIdAndUpdate(
      id,
      { groupName }, 
      { new: true, runValidators: true } 
    );
    if (!updatedGroup) {
      return res.status(404).json({ error: "Group not found." });
    }
    res.status(200).json({ message: "Group name updated successfully", group: updatedGroup });
  } catch (error) {
    console.error("Error updating group name:", error);
    res.status(500).json({ error: "An error occurred while updating the group name." });
  }
};
const getTotalWorks = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }
    const totalWorks = await Work.countDocuments({ customer: customerId });
    return res.status(200).json({ totalWorks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const getCompletedWorks = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }
    const completedWorks = await Work.countDocuments({
      customer: customerId,
      currentStatus: "Completed"
    });

    return res.status(200).json({ completedWorks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const getAssignedWorks = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }
    const assignedWorks = await Work.countDocuments({
      customer: customerId,
      currentStatus: "Assigned"
    });

    return res.status(200).json({ assignedWorks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
const getWorkStatusSummary = async (req, res) => {
  try {
    const { customerId } = req.params;
    if (!customerId) {
      return res.status(400).json({ message: "Customer ID is required" });
    }
    const workSummary = await Work.aggregate([
      { $match: { customer: mongoose.Types.ObjectId(customerId) } },
      {
        $group: {
          _id: "$currentStatus",
          count: { $sum: 1 }
        }
      }
    ]);
    const summary = workSummary.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});
    return res.status(200).json(summary);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

const getWorksByEmployee = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (!employeeId) {
      return res.status(400).json({ message: "Employee ID is required" });
    }
    const worksByEmployee = await Work.find({ assignedEmployee: employeeId });
    return res.status(200).json(worksByEmployee);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export {createCustomer ,getCustomer , getAllCustomers , updateCustomer , deleteCustomer , createGroup , addCustomerToGroup , removeCustomerFromGroup , getAllGroups , getSingleGroup , deleteGroup ,updateGroupName , getUniqueFirmNames , getPAN}