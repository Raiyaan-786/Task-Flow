import mongoose from "mongoose";
import { Customer, CustomerGroup } from "../models/customer.model.js";
import { Work } from "../models/work.model.js"; 

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
const getAllUnassignedCustomers = async (req, res) => {
  try {
    const unassignedCustomers = await Customer.find({ groupName: null });
    res.status(200).json({ unassignedCustomers });
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

// const createGroup = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);
//     const { groupName, customerIds } = req.body;

//     if (!groupName) {
//       return res.status(400).json({ error: "Group name is required." });
//     }
//     const customers = customerIds
//       ? await Customer.find({ _id: { $in: customerIds } })
//       : [];
//     const newGroup = new CustomerGroup({
//       groupName,
//       customers: customers.map(customer => customer._id),
//     });
//     await newGroup.save();
//     res.status(201).json({ message: "Group created successfully", group: newGroup });
//   } catch (error) {
//     console.error("Error creating group:", error); 
//     res.status(500).json({ error: "An error occurred while creating the group." });
//   }
// };

// const createGroup = async (req, res) => {
//   try {
//     console.log("Request Body:", req.body);
//     const { groupName, customerIds, groupAdmin } = req.body;
//     if (!groupName) {
//       return res.status(400).json({ error: "Group name is required." });
//     }
//     if (!groupAdmin) {
//       return res.status(400).json({ error: "Group admin is required." });
//     }
//     const admin = await Customer.findById(groupAdmin);
//     if (!admin) {
//       return res.status(400).json({ error: "Invalid group admin: Customer does not exist." });
//     }
//     const customers = customerIds
//       ? await Customer.find({ _id: { $in: customerIds } })
//       : [];
//     const adminInCustomers = customers.some(
//       (customer) => customer._id.toString() === groupAdmin
//     );
//     if (!adminInCustomers) {
//       return res
//         .status(400)
//         .json({ error: "Group admin must be included in the customers list." });
//     }
//     const newGroup = new CustomerGroup({
//       groupName,
//       customers: customers.map((customer) => customer._id),
//       groupAdmin, 
//     });
//     await newGroup.save();
//     res
//       .status(201)
//       .json({ message: "Group created successfully", group: newGroup });
//   } catch (error) {
//     console.error("Error creating group:", error);
//     res
//       .status(500)
//       .json({ error: "An error occurred while creating the group." });
//   }
// };

const createGroup = async (req, res) => {
  try {
    // console.log("Request Body:", req.body);
    const { groupName, customerIds, groupAdmin } = req.body;
    if (!groupName) {
      return res.status(400).json({ error: "Group name is required." });
    }
    if (!groupAdmin) {
      return res.status(400).json({ error: "Group admin is required." });
    }
    const admin = await Customer.findById(groupAdmin);
    if (!admin) {
      return res.status(400).json({ error: "Invalid group admin: Customer does not exist." });
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
    customer.groupName = groupId;
    await customer.save();
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
    const customer = await Customer.findById(customerId);
    if (customer) {
      customer.groupName = null;  
      await customer.save();
    }
    res.status(200).json({ message: "Customer removed from group successfully", group });
  } catch (error) {
    res.status(500).json({ error: "An error occurred while removing the customer from the group." });
  }
};

// const updateGroup= async (req, res) => {
//   try {
//     const { id } = req.params; // Group ID from the URL
//     const { groupName, groupAdmin } = req.body; // Group name and admin from the request body
//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ error: "Invalid group ID format." });
//     }
//     if (!groupName) {
//       return res.status(400).json({ error: "Group name is required." });
//     }
//     if (groupAdmin) {
//       if (!mongoose.Types.ObjectId.isValid(groupAdmin)) {
//         return res.status(400).json({ error: "Invalid group admin ID format." });
//       }
//       const adminExists = await Customer.findById(groupAdmin);
//       if (!adminExists) {
//         return res.status(400).json({ error: "Group admin does not exist." });
//       }
//     }
//     const updatedGroup = await CustomerGroup.findByIdAndUpdate(
//       id,
//       { groupName, ...(groupAdmin && { groupAdmin }) }, // Update groupAdmin only if it's provided
//       { new: true, runValidators: true } // Return the updated document and run validations
//     );

//     if (!updatedGroup) {
//       return res.status(404).json({ error: "Group not found." });
//     }
//     res.status(200).json({
//       message: "Group updated successfully",
//       group: updatedGroup,
//     });
//   } catch (error) {
//     console.error("Error updating group:", error);
//     res.status(500).json({ error: "An error occurred while updating the group." });
//   }
// };


const updateGroup = async (req, res) => {
  try {
    const { id } = req.params; // Group ID from the URL
    const { groupName, groupAdmin, customerIds } = req.body; // Group name, admin, and customers

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid group ID format." });
    }
    if (!groupName) {
      return res.status(400).json({ error: "Group name is required." });
    }

    if (groupAdmin) {
      if (!mongoose.Types.ObjectId.isValid(groupAdmin)) {
        return res.status(400).json({ error: "Invalid group admin ID format." });
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

    // Validate customers
    if (!Array.isArray(customerIds)) {
      return res.status(400).json({ error: "Invalid customers list." });
    }
    const validCustomers = await Customer.find({ _id: { $in: customerIds } });
    if (validCustomers.length !== customerIds.length) {
      return res.status(400).json({ error: "Some customers do not exist." });
    }

    // Update the group details
    group.groupName = groupName;
    if (groupAdmin) group.groupAdmin = groupAdmin;

    // Update the customers in the group
    group.customers = customerIds;
    await group.save();

    // Update each customer's groupName field
    await Customer.updateMany(
      { _id: { $in: customerIds } },
      { groupName: id }
    );

    res.status(200).json({
      message: "Group updated successfully",
      group,
    });
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ error: "An error occurred while updating the group." });
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
    await Customer.updateMany({ groupName: id }, { $set: { groupName: null } });
    res.status(200).json({ message: "Group deleted successfully, customers' groupName updated." });
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ error: "An error occurred while deleting the group." });
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

export {createCustomer ,getCustomer , getAllCustomers , updateCustomer , deleteCustomer , createGroup , addCustomerToGroup , removeCustomerFromGroup , getAllGroups , getSingleGroup , deleteGroup ,updateGroup , getUniqueFirmNames , getPAN , getAllUnassignedCustomers } 