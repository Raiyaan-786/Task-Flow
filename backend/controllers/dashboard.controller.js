import { User } from '../models/user.model.js';
import { Work } from '../models/work.model.js';
import { Customer } from '../models/customer.model.js';
import { CustomerGroup } from '../models/customer.model.js';


export const getWorkSummary = async (req, res) => {
  try {
    const workSummary = await User.aggregate([
      {
        $match: {
          role: { $in: ["Admin", "Manager", "Employee"] },
        },
      },
      {
        $lookup: {
          from: 'works', // Ensure this is the correct collection name
          localField: '_id',
          foreignField: 'assignedEmployee',
          as: 'works',
        },
      },
      {
        $project: {
          name: 1,
          role: 1,
          "workCounts.total": { $size: "$works" },
          "workCounts.done": {
            $size: {
              $filter: {
                input: "$works",
                as: "work",
                cond: { $eq: ["$$work.currentStatus", "Completed"] },
              },
            },
          },
          "workCounts.assigned": {
            $size: {
              $filter: {
                input: "$works",
                as: "work",
                cond: { $eq: ["$$work.currentStatus", "Assigned"] },
              },
            },
          },
          "workCounts.pickedUp": {
            $size: {
              $filter: {
                input: "$works",
                as: "work",
                cond: { $eq: ["$$work.currentStatus", "Picked Up"] },
              },
            },
          },
          "workCounts.customerVerification": {
            $size: {
              $filter: {
                input: "$works",
                as: "work",
                cond: { $eq: ["$$work.currentStatus", "Customer Verification"] },
              },
            },
          },
          "workCounts.readyForChecking": {
            $size: {
              $filter: {
                input: "$works",
                as: "work",
                cond: { $eq: ["$$work.currentStatus", "Ready for Checking"] },
              },
            },
          },
          "workCounts.holdWork": {
            $size: {
              $filter: {
                input: "$works",
                as: "work",
                cond: { $eq: ["$$work.currentStatus", "Hold Work"] },
              },
            },
          },
          "workCounts.evcPending": {
            $size: {
              $filter: {
                input: "$works",
                as: "work",
                cond: { $eq: ["$$work.currentStatus", "EVC Pending"] },
              },
            },
          },
          "workCounts.cancel": {
            $size: {
              $filter: {
                input: "$works",
                as: "work",
                cond: { $eq: ["$$work.currentStatus", "Cancel"] },
              },
            },
          },
        },
      },
    ]);

    res.status(200).json(workSummary);
  } catch (error) {
    console.error('Error fetching work summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getWorkSummaryByType = async (req, res) => {
  try {
    const workSummary = await Work.aggregate([ 
      {
        $group: { 
          _id: "$workType",
          totalWorks: { $sum: 1 }, 
          worksDone: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Completed"] }, 1, 0] } 
          },
          assignedWork: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Assigned"] }, 1, 0] } 
          },
          pickedUp: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Picked Up"] }, 1, 0] } 
          },
          customerVerification: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Customer Verification"] }, 1, 0] } 
          },
          readyForChecking: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Ready for Checking"] }, 1, 0] } 
          },
          holdWork: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Hold Work"] }, 1, 0] } 
          },
          evcPending: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "EVC Pending"] }, 1, 0] } 
          },
          cancel: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Cancel"] }, 1, 0] }
          }
        }
      },
      {
        $project: { 
          _id: 0, 
          workType: "$_id",
          totalWorks: 1,
          worksDone: 1,
          assignedWork: 1,
          pickedUp: 1,
          customerVerification: 1,
          readyForChecking: 1,
          holdWork: 1,
          evcPending: 1,
          cancel: 1
        }
      }
    ]);
    res.status(200).json(workSummary);
  } catch (error) {
    console.error('Error fetching work summary:', error);
    res.status(500).json({ message: 'Server error' });
  }  
};

export const getCustomerSummary = async (req, res) => {
  try {
    const customerSummary = await Customer.aggregate([
      {
        $lookup: {
          from: 'works', // Ensure this is the correct collection name
          localField: '_id',
          foreignField: 'customer',
          as: 'works',
        },
      },
      {
        $project: {
          customerName: 1,
          customerCode: 1,
          works: 1,  // Project the raw works array to check if it's being populated correctly
          "workCounts.total": { $size: "$works" },
          "workCounts.done": {
            $size: {
              $filter: {
                input: "$works", 
                as: "work", 
                cond: { $eq: ["$$work.currentStatus", "Completed"] },
              },
            },
          },
          "workCounts.assigned": {
            $size: {
              $filter: {
                input: "$works",
                as: "work", 
                cond: { $eq: ["$$work.currentStatus", "Assigned"] },
              },
            },
          },
          "workCounts.pickedUp": {
            $size: {
              $filter: {
                input: "$works",
                as: "work", 
                cond: { $eq: ["$$work.currentStatus", "Picked Up"] },
              },
            },
          },
          "workCounts.customerVerification": {
            $size: {
              $filter: {
                input: "$works",
                as: "work", 
                cond: { $eq: ["$$work.currentStatus", "Customer Verification"] },
              },
            },
          },
          "workCounts.readyForChecking": {
            $size: {
              $filter: {
                input: "$works",
                as: "work", 
                cond: { $eq: ["$$work.currentStatus", "Ready for Checking"] },
              },
            },
          },
          "workCounts.holdWork": {
            $size: {
              $filter: {
                input: "$works",
                as: "work", 
                cond: { $eq: ["$$work.currentStatus", "Hold Work"] },
              },
            },
          },
          "workCounts.evcPending": {
            $size: {
              $filter: {
                input: "$works",
                as: "work", 
                cond: { $eq: ["$$work.currentStatus", "EVC Pending"] },
              },
            },
          },
          "workCounts.cancel": {
            $size: {
              $filter: {
                input: "$works",
                as: "work", 
                cond: { $eq: ["$$work.currentStatus", "Cancel"] },
              },
            },
          },
        },
      },
    ]);
    // Return customer summary with raw works data for debugging
    res.status(200).json(customerSummary);
  } catch (error) {
    console.error('Error fetching customer summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



export const getCustomerGroupSummary = async (req, res) => {
  try {
    const customerGroupSummary = await CustomerGroup.aggregate([
      {
        $lookup: {
          from: 'customers', // Ensure this is the correct collection name
          localField: 'customers',
          foreignField: '_id',
          as: 'groupCustomers',
        },
      },
      {
        $unwind: '$groupCustomers', // Unwind customers array to access each customer
      },
      {
        $lookup: {
          from: 'works', // Ensure this is the correct collection name
          localField: 'groupCustomers._id',
          foreignField: 'customer',
          as: 'works',
        },
      },
      {
        $project: {
          groupName: 1,
          works: 1, // Include the works array in the projection
        },
      },
      {
        $addFields: {
          workCounts: {
            total: { $size: '$works' },
            done: {
              $size: {
                $filter: {
                  input: '$works',
                  as: 'work',
                  cond: { $eq: ['$$work.currentStatus', 'Completed'] },
                },
              },
            },
            assigned: {
              $size: {
                $filter: {
                  input: '$works',
                  as: 'work',
                  cond: { $eq: ['$$work.currentStatus', 'Assigned'] },
                },
              },
            },
            pickedUp: {
              $size: {
                $filter: {
                  input: '$works',
                  as: 'work',
                  cond: { $eq: ['$$work.currentStatus', 'Picked Up'] },
                },
              },
            },
            customerVerification: {
              $size: {
                $filter: {
                  input: '$works',
                  as: 'work',
                  cond: { $eq: ['$$work.currentStatus', 'Customer Verification'] },
                },
              },
            },
            readyForChecking: {
              $size: {
                $filter: {
                  input: '$works',
                  as: 'work',
                  cond: { $eq: ['$$work.currentStatus', 'Ready for Checking'] },
                },
              },
            },
            holdWork: {
              $size: {
                $filter: {
                  input: '$works',
                  as: 'work',
                  cond: { $eq: ['$$work.currentStatus', 'Hold Work'] },
                },
              },
            },
            evcPending: {
              $size: {
                $filter: {
                  input: '$works',
                  as: 'work',
                  cond: { $eq: ['$$work.currentStatus', 'EVC Pending'] },
                },
              },
            },
            cancel: {
              $size: {
                $filter: {
                  input: '$works',
                  as: 'work',
                  cond: { $eq: ['$$work.currentStatus', 'Cancel'] },
                },
              },
            },
          },
        },
      },
      {
        $group: {
          _id: '$groupName', // Group by customer group name
          totalWorks: { $sum: '$workCounts.total' },
          worksDone: { $sum: '$workCounts.done' },
          assignedWorks: { $sum: '$workCounts.assigned' },
          pickedUpWorks: { $sum: '$workCounts.pickedUp' },
          customerVerificationWorks: { $sum: '$workCounts.customerVerification' },
          readyForCheckingWorks: { $sum: '$workCounts.readyForChecking' },
          holdWorks: { $sum: '$workCounts.holdWork' },
          evcPendingWorks: { $sum: '$workCounts.evcPending' },
          cancelledWorks: { $sum: '$workCounts.cancel' },
        },
      },
      {
        $project: {
          _id: 0,
          groupName: '$_id',
          totalWorks: 1,
          worksDone: 1,
          assignedWorks: 1,
          pickedUpWorks: 1,
          customerVerificationWorks: 1,
          readyForCheckingWorks: 1,
          holdWorks: 1,
          evcPendingWorks: 1,
          cancelledWorks: 1,
        },
      },
    ]);

    res.status(200).json(customerGroupSummary);
  } catch (error) {
    console.error('Error fetching customer group summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getEmployeeWorks = async (req, res) => {
  const { employeeId } = req.params; 
  const { status } = req.query; 
  if (!employeeId || !status) {
    return res.status(400).json({ error: 'Employee ID and status are required.' });
  }
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
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value.' });
  }
  try {
    const employee = await User.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }
    const works = await Work.find({ assignedEmployee: employeeId, currentStatus: status });
    res.json({ works });
  } catch (err) {
    console.error("Error fetching employee works:", err);
    res.status(500).json({ error: 'Server error. Failed to fetch works.' });
  }
};


