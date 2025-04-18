import { CustomerDocument } from './models/customerDocument.model.js';
import cloudinary from "../lib/cloudinary.js";
import { Customer } from "../models/customer.model.js";

export const uploadAadharCard = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide Aadhar Card file to upload' 
      });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'customer_documents/aadhar',
      resource_type: 'auto'
    });

    let customerDocument = await CustomerDocument.findOne({ customerId: req.params.customerId });

    if (!customerDocument) {
      customerDocument = new CustomerDocument({
        customerId: req.params.customerId,
        aadharCard: result.secure_url
      });
    } else {
      customerDocument.aadharCard = result.secure_url;
    }

    await customerDocument.save();

    return res.status(200).json({
      success: true,
      message: 'Aadhar Card uploaded successfully',
      data: {
        aadharCard: customerDocument.aadharCard
      }
    });

  } catch (error) {
    console.error('Error uploading Aadhar Card:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error uploading Aadhar Card',
      error: error.message 
    });
  }
};

export const uploadPanCard = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide PAN Card file to upload' 
      });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'customer_documents/pan',
      resource_type: 'auto'
    });

    let customerDocument = await CustomerDocument.findOne({ customerId: req.params.customerId });

    if (!customerDocument) {
      customerDocument = new CustomerDocument({
        customerId: req.params.customerId,
        panCard: result.secure_url
      });
    } else {
      customerDocument.panCard = result.secure_url;
    }

    await customerDocument.save();

    return res.status(200).json({
      success: true,
      message: 'PAN Card uploaded successfully',
      data: {
        panCard: customerDocument.panCard
      }
    });

  } catch (error) {
    console.error('Error uploading PAN Card:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error uploading PAN Card',
      error: error.message 
    });
  }
};

export const getCustomerDocuments = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }

    const customerDocument = await CustomerDocument.findOne({ 
      customerId: req.params.customerId 
    }).select('aadharCard panCard');

    if (!customerDocument) {
      return res.status(404).json({ 
        success: false, 
        message: 'No documents found for this customer' 
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Documents retrieved successfully',
      data: customerDocument
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching documents',
      error: error.message 
    });
  }
};


export const getSpecificDocument = async (req, res) => {
  try {
    const { customerId, docType } = req.params;

    if (!['aadharCard', 'panCard'].includes(docType)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid document type. Must be either "aadharCard" or "panCard"' 
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ 
        success: false, 
        message: 'Customer not found' 
      });
    }

    const customerDocument = await CustomerDocument.findOne({ customerId })
      .select(docType);

    if (!customerDocument || !customerDocument[docType]) {
      return res.status(404).json({ 
        success: false, 
        message: `${docType === 'aadharCard' ? 'Aadhar Card' : 'PAN Card'} not found for this customer` 
      });
    }

    return res.status(200).json({
      success: true,
      message: `${docType === 'aadharCard' ? 'Aadhar Card' : 'PAN Card'} retrieved successfully`,
      data: {
        documentType: docType,
        url: customerDocument[docType]
      }
    });

  } catch (error) {
    console.error('Error fetching document:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Error fetching document',
      error: error.message 
    });
  }
};