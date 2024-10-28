import { User } from '../models/user.model.js';
import { Work } from '../models/work.model.js';

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


