import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaSave } from "react-icons/fa";
import { tenantLogout } from "../../features/tenantAuthSlice";
import {
  Typography,
  Paper,
  Box,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  styled,
  alpha,
} from "@mui/material";
import { useTheme } from '@emotion/react';
import { tokens } from '../../theme';

const TenantSettings = () => {

  const BlueSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: colors.blueHighlight[900],
    '&:hover': {
      backgroundColor: alpha(colors.blueHighlight[900], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: colors.blueHighlight[900],
  },
}));

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { tenant } = useSelector((state) => state.tenantAuth);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [emailPrefs, setEmailPrefs] = useState({
    promotions: true,
    updates: true,
    newsletters: false,
  });
  const [companyName, setCompanyName] = useState(tenant?.companyName || "");
  const [contactEmail, setContactEmail] = useState(tenant?.email || "");
  const [dataExportFormat, setDataExportFormat] = useState("csv");
  const [language, setLanguage] = useState("en");

  const handleEmailPrefChange = (type) => {
    setEmailPrefs({
      ...emailPrefs,
      [type]: !emailPrefs[type],
    });
  };

  const handleLogout = () => {
    dispatch(tenantLogout());
    navigate("/tenantlogin");
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
    // In a real app, dispatch an action to save settings, including new fields
  };

  const handleChangePassword = () => {
    navigate("/tenant/change-password");
  };

  const handleDataExport = () => {
    alert(`Data export requested in ${dataExportFormat.toUpperCase()} format`);
    // In a real app, trigger data export API call
  };

  return (
    <Box sx={{ p: 3, bgcolor: colors.foreground[100], height: '100vh' }}>
      <Typography variant="h1" fontWeight={700} mt={5} mb={2} className="pricing-section-title">
        Account <span className="pricing-gradient-text">Settings</span>
      </Typography>
      <Typography variant="h4" className="pricing-section-subtitle" mb={3}>
        Manage your account preferences and settings
      </Typography>

      <Paper
        sx={{
          p: 3,
          mt: 3,
          borderRadius: 2,
          boxShadow: 2,
          bgcolor: colors.foreground[100],
        }}
      >
        {/* Notification Settings Section */}
        <Typography variant="h5" gutterBottom>
          Notification Settings
        </Typography>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <BlueSwitch
                checked={notifications}
                onChange={() => setNotifications(!notifications)}
                color="primary"
              />
            }
            label="Enable notifications"
          />
          {/* <FormControlLabel
            control={
              <Switch
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
                color="primary"
              />
            }
            label="Dark mode"
          /> */}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Email Preferences Section */}
        <Typography variant="h5" gutterBottom>
          Email Preferences
        </Typography>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <BlueSwitch
                checked={emailPrefs.promotions}
                onChange={() => handleEmailPrefChange("promotions")}
                color="initial"
              />
            }
            label="Promotional emails"
          />
          <FormControlLabel
            control={
              <BlueSwitch
                checked={emailPrefs.updates}
                onChange={() => handleEmailPrefChange("updates")}
                color="primary"
              />
            }
            label="Product updates"
          />
          <FormControlLabel
            control={
              <BlueSwitch
                checked={emailPrefs.newsletters}
                onChange={() => handleEmailPrefChange("newsletters")}
                color="tertiary"
              />
            }
            label="Newsletters"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Security Settings Section */}
        <Typography variant="h5" gutterBottom>
          Security Settings
        </Typography>
        <Box sx={{ mb: 3 }}>
          <FormControlLabel
            control={
              <BlueSwitch
                checked={twoFactorAuth}
                onChange={() => setTwoFactorAuth(!twoFactorAuth)}
                
              />
            }
            label="Enable two-factor authentication"
          />
          {/* <Button
            variant="outlined"
            onClick={handleChangePassword}
            sx={{
              mt: 2,
              borderColor: colors.blueAccent[500],
              color: colors.blueAccent[500],
              "&:hover": { borderColor: colors.blueAccent[700], color: colors.blueAccent[700] },
              px: 3,
              py: 1,
              borderRadius: 1,
            }}
          >
            Change Password
          </Button> */}
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* Data Export Section */}
        <Typography variant="h5" gutterBottom>
          Data Export
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 120 }}>
            {/* <InputLabel id="data-export-format-label">Export Format</InputLabel> */}
            <Select
            size="small"
              labelId="data-export-format-label"
              value={dataExportFormat}
              onChange={(e) => setDataExportFormat(e.target.value)}
              // label="Export Format"
            >
              <MenuItem value="csv">CSV</MenuItem>
              <MenuItem value="json">JSON</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            onClick={handleDataExport}
            className="gradient-button"
            sx={{
              backgroundColor: colors.blueHighlight[900],
              "&:hover": { backgroundColor: colors.blueHighlight[900] },
              px: 3,
              py: 1,
              borderRadius: 1,
              textTransform: 'none',
              fontSize: '0.756rem',
            }}
          >
            Request Data Export
          </Button>
        </Box>

        <Divider sx={{ my: 3 }} />

       

        <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<FaSave />}
            onClick={handleSave}
            className="gradient-button"
            sx={{
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#45a049" },
              px: 3,
              py: 1,
              borderRadius: 1,
              textTransform: 'none',
              fontSize:'0.756rem'
            }}
          >
            Save Settings
          </Button>
          
        </Box>
      </Paper>
    </Box>
  );
};

export default TenantSettings;