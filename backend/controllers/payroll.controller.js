import { User } from "../models/user.model.js";
import { Payroll } from "../models/payroll.model.js";

const createPayroll = async (req, res) => {
  try {
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

    const existingEmployee = await User.findById(employee);

    if (!existingEmployee) {
      return res
        .status(400)
        .json({ error: "Invalid employee ID: Employee does not exist" });
    }

    const newPayroll = new Payroll({
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

    res
      .status(201)
      .json({
        message: "Payroll record created successfully",
        payroll: newPayroll,
      });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getPayroll = async (req, res) => {
  try {
    const { id } = req.params;
    const payroll = await Payroll.findById(id);

    if (!payroll) {
      return res.status(404).json({ error: "Payroll record not found" });
    }

    res.status(200).json(payroll);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export { createPayroll ,getPayroll};
