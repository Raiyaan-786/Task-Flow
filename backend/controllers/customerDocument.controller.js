import { CustomerDocument } from "../models/customerDocument.model.js";
import cloudinary from "../lib/cloudinary.js";
import { Customer } from "../models/customer.model.js";
import { PassThrough } from "stream";

// Helper function (can be in a separate utils file)
const uploadToCloudinary = async (fileBuffer, filename, folder) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: folder,
        public_id: filename.replace(/\.[^/.]+$/, ""), // Remove file extension
        format: "jpg",
        quality: "auto:good",
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

export const uploadDocument = async (req, res) => {
  try {
    const { customerId, documentType } = req.params;
    const validDocumentTypes = ["aadhar", "pan", "passport", "drivinglicense"];

    // Validate document type
    if (!validDocumentTypes.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid document type. Valid types are: ${validDocumentTypes.join(
          ", "
        )}`,
      });
    }

    // Check customer exists
    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Validate file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    console.log("File received:", req.file);
    console.log("File properties:", {
      originalname: req.file?.originalname,
      mimetype: req.file?.mimetype,
      size: req.file?.size,
    });

    // Upload to Cloudinary
    const result = await uploadToCloudinary(
      req.file.buffer,
      req.file.originalname,
      `customer_documents/${documentType}`
    );

    // Prepare document data
    const documentData = {
      url: result.secure_url,
      publicId: result.public_id,
      filename: req.file.originalname,
      fileType: result.resource_type,
      uploadedAt: new Date(),
      verified: false,
    };

    // Update customer document
    const updateField = `${documentType}Card`;
    const updatedDocument = await CustomerDocument.findOneAndUpdate(
      { customerId },
      { [updateField]: documentData },
      { upsert: true, new: true }
    );

    return res.status(200).json({
      success: true,
      message: `${documentType.toUpperCase()} uploaded successfully`,
      document: {
        type: documentType,
        ...documentData,
      },
    });
  } catch (error) {
    console.error("Document upload error:", error);

    const statusCode = error.http_code === 400 ? 400 : 500;
    const message =
      error.http_code === 400
        ? "Invalid file format or empty file"
        : "Document upload failed";

    return res.status(statusCode).json({
      success: false,
      message: message,
      error: error.message,
    });
  }
};

export const getCustomerDocuments = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const customerDocument = await CustomerDocument.findOne({
      customerId: req.params.customerId,
    }).select("aadharCard panCard");

    if (!customerDocument) {
      return res.status(404).json({
        success: false,
        message: "No documents found for this customer",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Documents retrieved successfully",
      data: customerDocument,
    });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching documents",
      error: error.message,
    });
  }
};

export const getSpecificDocument = async (req, res) => {
  try {
    const { customerId, docType } = req.params;

    if (!["aadharCard", "panCard"].includes(docType)) {
      return res.status(400).json({
        success: false,
        message:
          'Invalid document type. Must be either "aadharCard" or "panCard"',
      });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const customerDocument = await CustomerDocument.findOne({
      customerId,
    }).select(docType);

    if (!customerDocument || !customerDocument[docType]) {
      return res.status(404).json({
        success: false,
        message: `${
          docType === "aadharCard" ? "Aadhar Card" : "PAN Card"
        } not found for this customer`,
      });
    }

    return res.status(200).json({
      success: true,
      message: `${
        docType === "aadharCard" ? "Aadhar Card" : "PAN Card"
      } retrieved successfully`,
      data: {
        documentType: docType,
        url: customerDocument[docType],
      },
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching document",
      error: error.message,
    });
  }
};
