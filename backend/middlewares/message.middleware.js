import { User } from "../models/User.js";
import { Customer } from "../models/Customer.js";
import { Work } from "../models/Work.js";


const canSendMessage = async (sender, receiver) => {
  if (!receiver) return false;

  const isReceiverUser = receiver instanceof User;
  const isReceiverCustomer = receiver instanceof Customer;

  // Admin can message anyone
  if (sender.role === "Admin") {
    return true;
  }

  // Manager can message Employees and Customers
  if (sender.role === "Manager") {
    if (isReceiverUser && receiver.role === "Employee") return true;
    if (isReceiverCustomer) return true;
  }

  // Employee can message only Customers (who have work assigned to them)
  if (sender.role === "Employee" && isReceiverCustomer) {
    const assignedWork = await Work.exists({
      assignedEmployee: sender._id,
      customer: receiver._id,
    });

    return assignedWork ? true : false; // Employee can only message assigned Customers
  }

  return false;
};

export default canSendMessage;