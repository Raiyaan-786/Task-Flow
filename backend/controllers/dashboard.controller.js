// controllers/summary.controller.js
import { Tenant } from '../models/tenant.model.js';
import { getTenantConnection } from '../utils/tenantDb.js';

export const getWorkSummary = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantUser = models.User;
    const TenantWork = models.Work;

    const workSummary = await TenantUser.aggregate([
      {
        $match: {
          role: { $in: ["Admin", "Manager", "Employee"] },
        },
      },
      {
        $lookup: {
          from: TenantWork.collection.collectionName, // Use the tenant-specific Work collection name
          localField: '_id',
          foreignField: 'assignedEmployee',
          as: 'works',
        },
      },
      {
        $project: {
          name: 1,
          role: 1,
          image: 1,
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
    const { tenantId } = req.user; // Extracted from JWT middleware

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantWork = models.Work;

    const workSummary = await TenantWork.aggregate([
      {
        $group: {
          _id: "$workType",
          totalWorks: { $sum: 1 },
          worksDone: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Completed"] }, 1, 0] },
          },
          assignedWork: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Assigned"] }, 1, 0] },
          },
          pickedUp: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Picked Up"] }, 1, 0] },
          },
          customerVerification: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Customer Verification"] }, 1, 0] },
          },
          readyForChecking: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Ready for Checking"] }, 1, 0] },
          },
          holdWork: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Hold Work"] }, 1, 0] },
          },
          evcPending: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "EVC Pending"] }, 1, 0] },
          },
          cancel: {
            $sum: { $cond: [{ $eq: ["$currentStatus", "Cancel"] }, 1, 0] },
          },
        },
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
          cancel: 1,
        },
      },
    ]);

    res.status(200).json(workSummary);
  } catch (error) {
    console.error('Error fetching work summary by type:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCustomerSummary = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantCustomer = models.Customer;
    const TenantWork = models.Work;

    const customerSummary = await TenantCustomer.aggregate([
      {
        $lookup: {
          from: TenantWork.collection.collectionName, // Use the tenant-specific Work collection name
          localField: '_id',
          foreignField: 'customer',
          as: 'works',
        },
      },
      {
        $project: {
          customerName: 1,
          customerCode: 1,
          customerImage: 1, // Assuming this field exists in the Customer schema
          works: 1, // Include for debugging if needed
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

    res.status(200).json(customerSummary);
  } catch (error) {
    console.error('Error fetching customer summary:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCustomerGroupSummary = async (req, res) => {
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantCustomerGroup = models.CustomerGroup;
    const TenantCustomer = models.Customer;
    const TenantWork = models.Work;

    const customerGroupSummary = await TenantCustomerGroup.aggregate([
      {
        $lookup: {
          from: TenantCustomer.collection.collectionName, // Use the tenant-specific Customer collection name
          localField: 'customers',
          foreignField: '_id',
          as: 'groupCustomers',
        },
      },
      {
        $unwind: '$groupCustomers',
      },
      {
        $lookup: {
          from: TenantWork.collection.collectionName, // Use the tenant-specific Work collection name
          localField: 'groupCustomers._id',
          foreignField: 'customer',
          as: 'works',
        },
      },
      {
        $project: {
          groupName: 1,
          works: 1,
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
          _id: '$groupName',
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
  try {
    const { tenantId } = req.user; // Extracted from JWT middleware
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
      "Mute",
      "Total Works",
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant || !tenant.databaseName) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Switch to tenant-specific database
    const { models } = await getTenantConnection(tenantId, tenant.databaseName);
    const TenantUser = models.User;
    const TenantWork = models.Work;

    // Validate employee exists in the tenant's database
    const employee = await TenantUser.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found.' });
    }

    let works;
    if (status === 'Total Works') {
      works = await TenantWork.find({ assignedEmployee: employeeId });
    } else {
      works = await TenantWork.find({ assignedEmployee: employeeId, currentStatus: status });
    }

    res.status(200).json({ works });
  } catch (err) {
    console.error("Error fetching employee works:", err);
    res.status(500).json({ error: 'Server error. Failed to fetch works.' });
  }
};