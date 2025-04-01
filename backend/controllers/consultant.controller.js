import { Consultant } from "../models/consultant.model.js";
import cloudinary from "../lib/cloudinary.js";

const createConsultant = async (req, res) => {
  try {
    const {
      consultantName,
      email,
      mobile,
      address,
      username,
      bankAccountNumber,
      bankIFSCCode,
      accountHolderName,
    } = req.body;

    let signatureUrl = null;

    // Check if a signature file is provided
    if (req.file) {
      // Upload the signature to Cloudinary
      const uploadResult = cloudinary.uploader.upload_stream(
        { folder: 'consultant_signatures' },  // Optional: Save in a specific folder
        async (error, result) => {
          if (error) {
            return res.status(500).json({ message: 'Signature upload failed', error });
          }

          // Get the Cloudinary URL of the uploaded signature
          signatureUrl = result.secure_url;

          // Create the new Consultant with the signature URL
          const newConsultant = new Consultant({
            consultantName,
            email,
            mobile,
            address,
            username,
            bankAccountNumber,
            bankIFSCCode,
            accountHolderName,
            signature: signatureUrl,  // Store the Cloudinary URL instead of base64
          });

          await newConsultant.save();
          res.status(201).json({ message: 'Consultant created successfully', consultant: newConsultant });
        }
      ).end(req.file.buffer);  // Ensure that the file buffer is passed to Cloudinary
    } else {
      // If no signature is uploaded, create the consultant without a signature
      const newConsultant = new Consultant({
        consultantName,
        email,
        mobile,
        address,
        username,
        bankAccountNumber,
        bankIFSCCode,
        accountHolderName,
        signature: signatureUrl,  // Will be null if no file is uploaded
      });

      await newConsultant.save();
      res.status(201).json({ message: 'Consultant created successfully', consultant: newConsultant });
    }

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getConsultant = async (req, res) => {
  try {
    const { id } = req.params;
    const consultant = await Consultant.findById(id);

    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    res.status(200).json(consultant);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllConsultants = async (req, res) => {
  try {
    const consultants = await Consultant.find();
    res.status(200).json({ consultants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMuteConsultant = async (req, res) => {
  try {
    const consultants = await Consultant.find({ status: "Mute" });
    res.status(200).json({ consultants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateConsultant = async (req, res) => {
  try {
    const { id } = req.params;

    const updateData = { ...req.body };
    if (req.file) {
      updateData.signature = req.file.buffer; 
    } else if (req.body.signature) {
      updateData.signature = Buffer.from(req.body.signature, "base64"); 
    }

    const updatedConsultant = await Consultant.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedConsultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    res.status(200).json({ message: "Consultant updated successfully", consultant: updatedConsultant });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteConsultant = async (req, res) => {
  try {
    const { id } = req.params;
    const consultant = await Consultant.findByIdAndDelete(id);

    if (!consultant) {
      return res.status(404).json({ error: "Consultant not found" });
    }

    res.status(200).json({ message: "Consultant deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export {
  createConsultant,
  getConsultant,
  getAllConsultants,
  updateConsultant,
  deleteConsultant,
  getMuteConsultant,
};
