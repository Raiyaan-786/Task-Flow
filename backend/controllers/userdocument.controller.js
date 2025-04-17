import { UserDocument } from './models/userDocument.model.js';
import { User } from '../models/user.model.js';
import { Customer } from '../models/customer.model.js';
import cloudinary from '../config/cloudinary.config.js';
import multer from 'multer';
import fs from 'fs/promises';
import path from 'path';

// Configure multer for file uploads
const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Upload/Update documents
export const uploadDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { user } = req;
    const files = req.files;

    // Check authorization
    if (user._id.toString() !== userId && user.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    // Find or create document record
    let document = await UserDocument.findOne({ userId });

    if (!document) {
      document = new UserDocument({ userId });
    }

    // Process Aadhar Card
    if (files.aadharCard) {
      const result = await cloudinary.uploader.upload(files.aadharCard[0].path, {
        folder: 'user-documents/aadhar'
      });
      document.aadharCard = result.secure_url;
      await fs.unlink(files.aadharCard[0].path);
    }

    // Process PAN Card
    if (files.panCard) {
      const result = await cloudinary.uploader.upload(files.panCard[0].path, {
        folder: 'user-documents/pan'
      });
      document.panCard = result.secure_url;
      await fs.unlink(files.panCard[0].path);
    }

    await document.save();

    // Update customer model if document belongs to a customer
    if (user.role === 'Customer') {
      await Customer.findByIdAndUpdate(userId, {
        $set: {
          PAN: document.panCard ? 'Uploaded' : '',
          AadharNo: document.aadharCard ? 'Uploaded' : ''
        }
      });
    }

    res.status(200).json({
      success: true,
      message: 'Documents uploaded successfully',
      document
    });

  } catch (error) {
    console.error('Document upload error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload documents' 
    });
  }
};

// Get user documents
export const getDocuments = async (req, res) => {
  try {
    const { userId } = req.params;
    const { user } = req;

    // Check authorization
    if (user._id.toString() !== userId && user.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const documents = await UserDocument.findOne({ userId });

    if (!documents) {
      return res.status(404).json({ error: 'No documents found' });
    }

    res.status(200).json({
      success: true,
      documents
    });

  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to fetch documents' 
    });
  }
};

// Delete document
export const deleteDocument = async (req, res) => {
  try {
    const { userId, docType } = req.params;
    const { user } = req;

    // Check authorization
    if (user._id.toString() !== userId && user.role !== 'Admin') {
      return res.status(403).json({ error: 'Unauthorized access' });
    }

    const document = await UserDocument.findOne({ userId });

    if (!document) {
      return res.status(404).json({ error: 'No documents found' });
    }

    // Delete from Cloudinary and database
    if (docType === 'aadhar' && document.aadharCard) {
      const publicId = document.aadharCard.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`user-documents/aadhar/${publicId}`);
      document.aadharCard = undefined;
    } 
    else if (docType === 'pan' && document.panCard) {
      const publicId = document.panCard.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`user-documents/pan/${publicId}`);
      document.panCard = undefined;
    } 
    else {
      return res.status(400).json({ error: 'Invalid document type' });
    }

    await document.save();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });

  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to delete document' 
    });
  }
};