import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";
import { Tenant } from "../models/tenant.model.js";
import { TenantPayment } from "../models/tenantpayment.model.js";
import { Plan } from "../models/plan.model.js";
import axios from 'axios';

export const registerTenant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingTenant = await Tenant.findOne({ email });
    if (existingTenant) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTenant = new Tenant({
      email,
      password: hashedPassword,
    });
    await newTenant.save();

    return res.status(201).json({newTenant, message: "Tenant registered successfully" });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const loginTenant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tenant = await Tenant.findOne({ email });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const isMatch = await bcrypt.compare(password, tenant.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: tenant._id, tenantId: tenant._id, role: "Tenant", subscriptionPlan: tenant.subscriptionPlan },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({tenant, token });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};


export const updateTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const updateData = { ...req.body };

    // Remove restricted fields
    delete updateData.plan;
    delete updateData.billing;
    delete updateData.loginCredentials;

    // Find existing tenant
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // If a new image is uploaded, replace the old one on Cloudinary
    if (req.file) {
      // First upload the new image to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "tenant_images" }, // Save in a different folder than user profiles
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      // Add the new image URL to update data
      updateData.image = uploadResult.secure_url;

      // If there was an old logo, delete it from Cloudinary
      if (tenant.image) {
        try {
          // Extract public_id from the URL (Cloudinary specific)
          const publicId = tenant.companyLogo.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`tenant_images/${publicId}`);
        } catch (error) {
          console.error("Error deleting old logo:", error);
          // Continue even if deletion fails - we don't want to fail the update
        }
      }
    }

    // Update tenant data in MongoDB
    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      updateData,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      message: "Tenant updated successfully",
      tenant: updatedTenant
    });

  } catch (error) {
    console.error("Error updating tenant:", error);
    return res.status(500).json({ 
      message: "Server Error", 
      error: error.message 
    });
  }
};

export const updateTenantPlanDetails = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { plan, billing, loginCredentials } = req.body;

    const updateFields = {};

    if (plan) updateFields.plan = plan;
    if (billing) updateFields.billing = billing;
    if (loginCredentials) updateFields.loginCredentials = loginCredentials;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ message: "No valid fields provided to update" });
    }

    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      updateFields,
      { new: true, runValidators: true }
    );

    if (!updatedTenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    return res.status(200).json({
      message: "Tenant plan, billing, or login credentials updated successfully",
      tenant: updatedTenant
    });
  } catch (error) {
    console.error("Error updating tenant plan details:", error);
    return res.status(500).json({ message: "Server Error", error });
  }
};

export const createPlan = async (req, res) => {
  try {
    const {
      tier,
      price,
      billingCycle,
      features,
      recommended
    } = req.body;

    const newPlan = new Plan({
      tier,
      price,
      billingCycle,
      features,
      recommended
    });

    await newPlan.save();

    res.status(201).json({ message: "Plan created successfully", plan: newPlan });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllPlans = async (req, res) => {
    try {
      const plans = await Plan.find();
      res.status(200).json({plans});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
};


const generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Helper function to calculate renewsAt date based on billingCycle
const calculateRenewsAt = (startsAt, billingCycle) => {
  const renewsAt = new Date(startsAt);
  if (billingCycle === 'monthly') {
    renewsAt.setMonth(renewsAt.getMonth() + 1);
  } else if (billingCycle === 'annual') {
    renewsAt.setFullYear(renewsAt.getFullYear() + 1);
  }
  return renewsAt;
};

export const processPayment = async (req, res) => {
  try {
    const {
      tenant,
      firstName,
      lastName,
      plan,
      amount,
      currency,
      cardNumber,
      expiry,
      cvv,
      billingCycle, // Assume this is passed from frontend
    } = req.body;

    // Validate required fields
    if (!tenant || !plan || !amount || !firstName || !lastName || !cardNumber || !expiry || !cvv || !billingCycle) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Fetch plan details
    const planData = await Plan.findById(plan);
    if (!planData) {
      return res.status(404).json({
        success: false,
        message: 'Plan not found',
      });
    }
    console.log("plan Data : " ,planData)
    // Simulate payment processing (since Stripe is not integrated yet)
    const payment = new TenantPayment({
      tenant,
      firstName,
      lastName,
      plan,
      amount,
      currency,
      cardNumber,
      expiry,
      cvv,
      status: 'completed',
    });

    await payment.save();

    // Fetch tenant details for registration
    const tenantData = await Tenant.findById(tenant);
    if (!tenantData) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found',
      });
    }

    // Generate login credentials
    const username = `${firstName.toLowerCase()}.${generateRandomString(6)}`;
    const password = generateRandomString(12); // In production, hash this for storage

    // Calculate plan dates
    const startsAt = new Date();
    const renewsAt = calculateRenewsAt(startsAt, billingCycle);

    // Update tenant's loginCredentials and plan details
    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenant,
      {
        $set: {
          'loginCredentials.username': username,
          'loginCredentials.password': password, // In production, hash this
          'plan.tier': planData.tier,
          'plan.price': amount,
          'plan.billingCycle': billingCycle,
          'plan.startsAt': startsAt,
          'plan.renewsAt': renewsAt,
          'plan.status': 'active',
          'plan.isAutoRenew': true,
        },
      },
      { new: true }
    );

    if (!updatedTenant) {
      return res.status(404).json({
        success: false,
        message: 'Failed to update tenant details',
      });
    }

    res.status(200).json({
      success: true,
      paymentId: payment._id,
      message: 'Payment processed successfully, tenant details updated, and user registered in separate app',
      loginCredentials: {
        username,
        password, // For development only; remove in production
      },
      plan: {
        tier: planData.tier || 'basic',
        price: amount,
        billingCycle,
        startsAt: startsAt.toISOString(),
        renewsAt: renewsAt.toISOString(),
        status: 'active',
        isAutoRenew: true,
      },
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing payment: ' + error.message,
    });
  }
};


// export const processPayment = async (req, res) => {
//   try {
//     const {
//       tenant,
//       firstName,
//       lastName,
//       plan,
//       amount,
//       currency,
//       cardNumber,
//       expiry,
//       cvv,
//     } = req.body;

//     // Validate required fields
//     if (!tenant || !plan || !amount || !firstName || !lastName || !cardNumber || !expiry || !cvv) {
//       return res.status(400).json({
//         success: false,
//         message: 'Missing required fields',
//       });
//     }

//     // Simulate payment processing (since Stripe is not integrated yet)
//     const payment = new TenantPayment({
//       tenant,
//       firstName,
//       lastName,
//       plan,
//       amount,
//       currency,
//       cardNumber,
//       expiry,
//       cvv,
//       status: 'completed',
//     });

//     await payment.save();

//     // Update tenant's loginCredentials
//     const username = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${generateRandomString(4)}`;
//     const password = generateRandomString(12); // Generate a random 12-character password

//     const updatedTenant = await Tenant.findByIdAndUpdate(
//       tenant,
//       {
//         $set: {
//           'loginCredentials.username': username,
//           'loginCredentials.password': password, // In production, hash this password
//         },
//       },
//       { new: true }
//     );

//     if (!updatedTenant) {
//       return res.status(404).json({
//         success: false,
//         message: 'Tenant not found for updating login credentials',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       paymentId: payment._id,
//       message: 'Payment processed successfully and login credentials updated',
//       loginCredentials: {
//         username,
//         password, // For development only; remove in production
//       },
//     });
//   } catch (error) {
//     console.error('Payment processing error:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error processing payment: ' + error.message,
//     });
//   }
// };

export const getReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await TenantPayment.findById(paymentId)
      .populate('tenant', 'email')
      .populate('plan', 'name');

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    console.error('Receipt retrieval error:', error);
    res.status(500).json({
      success: false,
      message: 'Error retrieving receipt',
    });
  }
};
