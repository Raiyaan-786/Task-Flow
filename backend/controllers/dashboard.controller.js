import { User } from '../models/user.model.js';

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
