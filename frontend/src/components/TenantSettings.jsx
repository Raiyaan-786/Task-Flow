import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { tenantLogout } from "../features/tenantAuthSlice";
import { FaSave } from "react-icons/fa";
import {
  Typography,
  Paper,
  Box,
  Switch,
  FormControlLabel,
  Button,
} from "@mui/material";
import TenantLayout from "./TenantLayout";

const TenantSettings = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tenant } = useSelector((state) => state.tenantAuth);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [emailPrefs, setEmailPrefs] = useState({
    promotions: true,
    updates: true,
    newsletters: false,
  });

  const handleLogout = () => {
    dispatch(tenantLogout());
    navigate("/tenantlogin");
  };

  const handleEmailPrefChange = (type) => {
    setEmailPrefs({
      ...emailPrefs,
      [type]: !emailPrefs[type],
    });
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
    // In a real app, you would dispatch an action to save these settings
  };

  return (
    <TenantLayout>
      <Box>
        <Typography variant="h4" gutterBottom>
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" gutterBottom>
          Manage your account preferences and settings
        </Typography>

        <Paper sx={{ p: 3, mt: 3, borderRadius: 2, boxShadow: 2 }}>
          <Typography variant="h6" color="text.primary" gutterBottom>
            Preferences
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Notification Settings
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                  color="primary"
                />
              }
              label="Enable notifications"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={() => setDarkMode(!darkMode)}
                  color="primary"
                />
              }
              label="Dark mode"
            />
          </Box>

          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Email Preferences
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={emailPrefs.promotions}
                  onChange={() => handleEmailPrefChange("promotions")}
                  color="primary"
                />
              }
              label="Promotional emails"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={emailPrefs.updates}
                  onChange={() => handleEmailPrefChange("updates")}
                  color="primary"
                />
              }
              label="Product updates"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={emailPrefs.newsletters}
                  onChange={() => handleEmailPrefChange("newsletters")}
                  color="primary"
                />
              }
              label="Newsletters"
            />
          </Box>

          <Button
            variant="contained"
            startIcon={<FaSave />}
            onClick={handleSave}
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#45a049" },
              px: 3,
              py: 1,
              borderRadius: 1,
            }}
          >
            Save Settings
          </Button>
        </Paper>
      </Box>
    </TenantLayout>
  );
};

export default TenantSettings;
