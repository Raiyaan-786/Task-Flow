import { Customer } from "../models/customer.model.js";

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

export {createCustomer ,getCustomer , getAllCustomers , updateCustomer , deleteCustomer }