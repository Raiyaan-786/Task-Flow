import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cloudinary from "../lib/cloudinary.js";
import { Tenant } from "../models/tenant.model.js";
import { TenantPayment } from "../models/tenantpayment.model.js";
import { Plan } from "../models/plan.model.js";
import { getTenantConnection } from "../utils/tenantDb.js";
import { SharedUser } from "../models/sharedUser.model.js";

export const registerTenant = async (req, res) => {
  try {
    const { email, password ,phone , name} = req.body;
    const existingTenant = await Tenant.findOne({ email });
    if (existingTenant) return res.status(400).json({ error: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newTenant = new Tenant({
      name,
      email,
      phone,
      password: hashedPassword,
    });
    await newTenant.save();

    return res.status(201).json({newTenant, message: "Tenant registered successfully" });
  } catch (err) {
    console.log(err)
    return res.status(500).json({err, error: "Server error" });
  }
};

export const loginTenant = async (req, res) => {
  try {
    const { email, password } = req.body;
    const tenant = await Tenant.findOne({ email });
    if (!tenant) return res.status(404).json({ error: "Tenant not found" });

    const isMatch = await bcrypt.compare(password, tenant.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const tenanttoken = jwt.sign(
      { id: tenant._id, role: "Tenant", subscriptionPlan: tenant.subscriptionPlan },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    return res.status(200).json({tenant, tenanttoken });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
};

export const getTenant = async (req, res) => {
  try {
    const tenantId = req.user?.id; 

    if (!tenantId) {
      return res.status(401).json({ error: "Unauthorized: Tenant ID not found in token" });
    }

    const tenant = await Tenant.findById(tenantId).select('-password');
    if (!tenant) {
      return res.status(404).json({ error: "Tenant not found" });
    }

    return res.status(200).json({ success: true, tenant });
  } catch (err) {
    console.error("Error fetching tenant:", err);
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

const removeSpacesAndSpecialChars = (input, allowedChars = '') => {
  if (typeof input !== 'string') {
    throw new Error('Input must be a string');
  }

  // Escape special characters in allowedChars for regex
  const escapedAllowedChars = allowedChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
  // Create regex to keep only alphanumeric and allowed characters
  const regex = new RegExp(`[^a-zA-Z0-9${escapedAllowedChars}]`, 'g');
  
  return input
    .replace(regex, '') // Remove all characters except alphanumeric and allowed ones
    .toLowerCase(); // Optional: Convert to lowercase for consistency
};

export const processPayment = async (req, res) => {
  try {
    const {
      tenant,
      companyName,
      firstName,
      lastName,
      plan,
      amount,
      currency,
      cardNumber,
      expiry,
      cvv,
      billingCycle,
    } = req.body;

    // Validate required fields for payment
    if (!tenant || !plan || !amount || !firstName || !lastName || !cardNumber || !expiry || !cvv || !billingCycle || !companyName) {
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

    // Fetch tenant details
    const tenantData = await Tenant.findById(tenant);
    if (!tenantData) {
      return res.status(404).json({
        success: false,
        message: 'Tenant not found',
      });
    }

    // Simulate payment processing
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

    // Calculate plan dates
    const startsAt = new Date();
    const renewsAt = calculateRenewsAt(startsAt, billingCycle);

    // Check if the tenant's current plan is "free" (first-time subscription)
    const isFirstTimeSubscription = tenantData.plan.tier.toLowerCase() === 'free';

    let updatedTenant;
    let user = null;
    let shareduser = null;
    let username = tenantData.loginCredentials?.username || '';
    let password = tenantData.loginCredentials?.password || '';

    if (isFirstTimeSubscription) {
      // Scenario 1: First-time subscription (current plan is "free")
      const database = tenantData._id.toString();
      const { models } = await getTenantConnection(tenantData._id.toString(), database);
      const User = models.User;

      // Generate login credentials for tenant
      username = `${firstName.toLowerCase()}${tenantData._id.toString().slice(0, 10)}`;
      password = generateRandomString(12); // In production, hash this

      // Update tenant's loginCredentials, databaseName, and plan details
      updatedTenant = await Tenant.findByIdAndUpdate(
        tenant,
        {
          $set: {
            'companyName': companyName,
            'databaseName': database,
            'loginCredentials.username': username,
            'loginCredentials.password': password,
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

      // Create a user in the User collection
      const userName = username;
      const userEmail = tenantData.email;
      const userPassword = password;

      // Check if user already exists
      const existingUser = await User.findOne({ email: userEmail });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: 'User with this email or username already exists',
        });
      }

      const hashedPassword = await bcrypt.hash(userPassword, 10);

      // Create new user
      user = new User({
        tenantId: tenantData._id,
        name: tenantData.name,
        username: userName,
        email: userEmail,
        password: hashedPassword,
        role: "Admin",
      });
      await user.save();

      // Create a shared user
      shareduser = new SharedUser({
        tenantId: tenantData._id,
        email: userEmail,
        password: hashedPassword,
      });
      await shareduser.save();
      console.log(shareduser);
    } else {
      // Scenario 2: Plan upgrade (current plan is not "free")
      // Only update the plan details, keep loginCredentials, email, and databaseName unchanged
      updatedTenant = await Tenant.findByIdAndUpdate(
        tenant,
        {
          $set: {
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
          message: 'Failed to update tenant plan details',
        });
      }
    }

    // Prepare the response
    const response = {
      success: true,
      paymentId: payment._id,
      message: isFirstTimeSubscription
        ? 'Payment processed successfully, tenant details updated, and user registered'
        : 'Payment processed successfully, plan upgraded',
      plan: {
        tier: planData.tier || 'basic',
        price: amount,
        billingCycle,
        startsAt: startsAt.toISOString(),
        renewsAt: renewsAt.toISOString(),
        status: 'active',
        isAutoRenew: true,
      },
    };

    // Include additional fields for first-time subscription
    if (isFirstTimeSubscription) {
      response.loginCredentials = {
        username,
        password,
      };
      response.userId = user._id;
      response.user = {
        name: username,
        username: username,
        email: tenantData.email,
        role: "Admin",
      };
      response.shareduser = {
        email: tenantData.email,
        // companyName: tenantData.companyName,
        tenantId: tenantData._id,
      };
    }

    res.status(200).json(response);
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).json({
      success: false,
      message: `Error processing payment: ${error.message}`,
    });
  }
};
export const getReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await TenantPayment.findById(paymentId)
      .populate('tenant', 'email')
      .populate('plan', 'tier billingCycle');
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

export const getTransactions = async (req, res) => {
  try {
    // Get the tenant ID from the authenticated user (assumes middleware sets req.user)
    const tenantId = req.user?.id;

    // If tenant ID is not available, return an error
    if (!tenantId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Tenant ID not found",
      });
    }

    const transactions = await TenantPayment.find({ tenant: tenantId })
      .populate('tenant', 'email name') // Populate tenant's email and name
      .populate('plan', 'name tier price billingCycle') // Populate plan details
      .sort({ transactionDate: -1 }); // Sort by transaction date (newest first)

    if (!transactions || transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No transactions found for this tenant",
      });
    }

    // Return the transactions
    res.status(200).json({
      success: true,
      transactions,
    });
  } catch (error) {
    console.error('Transaction retrieval error:', error);
    res.status(500).json({
      success: false,
      message: "Error retrieving transactions",
      error: error.message,
    });
  }
};


export const updateTenantCompanyDetails = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const { companyName } = req.body;

    // Find the existing tenant
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // Check if the tenant's plan is "free"
    if (tenant.plan.tier === "free") {
      return res.status(403).json({
        message: "Tenants on the Free plan cannot update company name or logo",
      });
    }

    // Prepare the update data
    const updateData = {};

    // Update companyName if provided
    if (companyName) {
      updateData.companyName = companyName;
    }

    // If a new logo is uploaded, replace the old one on Cloudinary
    if (req.file) {
      // Upload the new logo to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "tenant_company_logos" }, // Save in a specific folder for logos
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        uploadStream.end(req.file.buffer);
      });

      // Add the new logo URL to update data
      updateData.companyLogo = uploadResult.secure_url;

      // If there was an old logo, delete it from Cloudinary
      if (tenant.companyLogo) {
        try {
          // Extract public_id from the URL (Cloudinary specific)
          const publicId = tenant.companyLogo.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(`tenant_company_logos/${publicId}`);
        } catch (error) {
          console.error("Error deleting old logo:", error);
          // Continue even if deletion fails
        }
      }
    }

    // If no updates are provided, return an error
    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ message: "No valid fields provided for update" });
    }

    // Update tenant data in MongoDB
    const updatedTenant = await Tenant.findByIdAndUpdate(
      tenantId,
      updateData,
      { new: true, runValidators: true }
    );
    return res.status(200).json({
      message: "Tenant company details updated successfully",
      tenant: updatedTenant,
    });
  } catch (error) {
    console.error("Error updating tenant company details:", error);
    return res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
