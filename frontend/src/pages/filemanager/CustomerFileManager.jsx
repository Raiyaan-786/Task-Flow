import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Autocomplete,
  Typography,
  IconButton,
  Input,
  useTheme,
  Button,
  Divider,
} from "@mui/material";
import { Search as SearchIcon, Close as CloseIcon } from "@mui/icons-material";

import API from "../../api/api";
import ModernButton from '../../components/ModernButton'
import { tokens } from "../../theme";

const CustomerFileManager = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const getColor = (colorKey, index, fallback) => colors[colorKey]?.[index] || fallback;

  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [files, setFiles] = useState({ aadharCard: null, panCard: null });
  const [error, setError] = useState("");

  const fetchCustomersAndEmployees = async () => {
    try {
      const customerResponse = await API.get("/getallcustomers");
      const mappedCustomers = customerResponse.data.customers.map((customer) => ({
        id: customer._id,
        name: customer.customerName,
        code: customer.customerCode,
        mobile: customer.mobileNo,
        email: customer.email,
      }));
      setCustomers(mappedCustomers);
    } catch (err) {
      setError("Failed to load customers");
    }
  };
  useEffect(() => {
    fetchCustomersAndEmployees();
  }, []);

  const handleCustomerSelect = (event, value) => {
    setSelectedCustomer(value);
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large (max 10MB)");
      return;
    }

    const validDocTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (
      (fileType === "aadharCard" || fileType === "panCard") &&
      !validDocTypes.includes(file.type)
    ) {
      setError(
        `${fileType === "aadharCard" ? "Aadhar" : "PAN"} card must be JPG, PNG, or PDF`
      );
      return;
    }

    setFiles((prev) => ({ ...prev, [fileType]: file }));
    setError("");
  };

  const handleUploadFiles = () => {
    if (!files.aadharCard && !files.panCard) {
      setError("No files selected for upload");
      return;
    }
    console.log("Uploading files:", files);
    setFiles({ aadharCard: null, panCard: null });
    setError("Files uploaded successfully");
  };

  const handleRequestFiles = (documentType) => {
    console.log(`Requesting ${documentType} for ${selectedCustomer?.name}`);
    setError(`Requested ${documentType} for ${selectedCustomer?.name}`);
  };

  return (
    <Box p={1} m="20px" height="67vh" overflow="auto">
      <Box
        sx={{
          mb: 2, // Increased margin for better separation
          p: 1,  // Kept minimal padding
          display: "flex",
          alignItems: "center",
        }}
      >
        <Autocomplete
          options={customers}
          getOptionLabel={(option) => option.name}
          value={selectedCustomer}
          onChange={handleCustomerSelect}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              placeholder="Search Customer..."
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "white",
                  borderRadius: 10,
                  "&:hover": {
                    borderColor: getColor("blueAccent", 400, "#868dfb"),
                  },
                },
                "& .MuiOutlinedInput-notchedOutline": {
                  borderColor: getColor("blueAccent", 300, "#a4a9fc"),
                },
                "& .Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: getColor("blueAccent", 500, "#6870fa"),
                },
                width: 250, // Kept at 250px as per your change
              }}
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <SearchIcon sx={{ color: getColor("blueAccent", 600, "#535ac8"), mr: 1 }} />
                ),
                endAdornment: selectedCustomer && (
                  <IconButton
                    onClick={() => setSelectedCustomer(null)}
                    sx={{ color: getColor("blueAccent", 600, "#535ac8") }}
                  >
                    <CloseIcon />
                  </IconButton>
                ),
              }}
            />
          )}
        />
      </Box>

      {selectedCustomer ? (
        <Box
          sx={{
            mb: 2, // Consistent margin
            p: 2,
            bgcolor: getColor("white", 500, "#ffffff"),
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: getColor("blueAccent", 800, "#2a2d64"), fontWeight: 700 }}
          >
            Customer Details
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              { label: "Name", value: selectedCustomer.name },
              { label: "Code", value: selectedCustomer.code },
              { label: "Mobile No", value: selectedCustomer.mobile },
              { label: "Email", value: selectedCustomer.email },
            ].map(({ label, value }) => (
              <Box key={label} sx={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Typography
                  variant="body1"
                  sx={{ width: 130, color: getColor("grey", 700, "#525252"), fontWeight: 500 }}
                >
                  {label}
                </Typography>
                <Typography variant="body1" sx={{ color: getColor("grey", 900, "#141414") }}>
                  {value || "N/A"}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      ) : (
        <Typography
          sx={{ color: getColor("grey", 600, "#666666"), fontStyle: "italic", mb: 2 }}
        >
          Please select a customer to view details
        </Typography>
      )}

      <Divider sx={{ borderColor: getColor("grey", 300, "#a3a3a3"), my: 2 }} />

      {selectedCustomer && (
        <Box
          sx={{
            mb: 2,
            p: 2,
            bgcolor: colors.primary[900],
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: getColor("blueAccent", 800, "#2a2d64"), fontWeight: 700 }}
          >
            Request Files
          </Typography>
          <Box sx={{ display: "flex", gap: 3 }}>
            <ModernButton
              variant="outlined"
              onClick={() => handleRequestFiles("Aadhaar Card")}
             
              
            >
              Request Aadhaar
            </ModernButton>
            <Button
              variant="outlined"
              onClick={() => handleRequestFiles("PAN Card")}
              sx={{
                color: getColor("blueAccent", 600, "#535ac8"),
                borderColor: getColor("blueAccent", 300, "#a4a9fc"),
                "&:hover": {
                  borderColor: getColor("blueAccent", 500, "#6870fa"),
                  backgroundColor: getColor("blueAccent", 50, "#eef2ff"),
                },
              }}
            >
              Request PAN
            </Button>
          </Box>
        </Box>
      )}

      {selectedCustomer && (
        <Box
          sx={{
            p: 2,
            bgcolor: getColor("white", 500, "#ffffff"),
            borderRadius: 2,
          }}
        >
          <Typography
            variant="h6"
            sx={{ mb: 2, color: getColor("blueAccent", 800, "#2a2d64"), fontWeight: 700 }}
          >
            Upload Files
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {[
              { id: "aadharCard", label: "Upload Aadhaar Card" },
              { id: "panCard", label: "Upload PAN Card" },
            ].map(({ id, label }) => (
              <Box key={id} sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                <Input
                  type="file"
                  id={id}
                  accept="image/jpeg,image/png,application/pdf"
                  onChange={(e) => handleFileChange(e, id)}
                  sx={{ display: "none" }}
                />
                <label htmlFor={id}>
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{
                      color: getColor("blueAccent", 600, "#535ac8"),
                      borderColor: getColor("blueAccent", 300, "#a4a9fc"),
                      "&:hover": {
                        borderColor: getColor("blueAccent", 500, "#6870fa"),
                        backgroundColor: getColor("blueAccent", 50, "#eef2ff"),
                      },
                    }}
                  >
                    {label}
                  </Button>
                </label>
                {files[id] && (
                  <Typography variant="body2" sx={{ color: getColor("grey", 600, "#666666") }}>
                    {files[id].name}
                  </Typography>
                )}
              </Box>
            ))}
            <ModernButton
              variant="contained"
              onClick={handleUploadFiles}
              disabled={!files.aadharCard && !files.panCard}
              sx={{
                mt: 3,
                alignSelf: "flex-start",
                backgroundColor: getColor("blueAccent", 600, "#535ac8"),
                color: "white",
                "&:hover": {
                  backgroundColor: getColor("blueAccent", 700, "#3e4396"),
                },
                "&:disabled": {
                  backgroundColor: getColor("grey", 300, "#a3a3a3"),
                  color: getColor("grey", 600, "#666666"),
                },
              }}
            >
              Upload Files
            </ModernButton>
            {error && (
              <Typography sx={{ color: getColor("redAccent", 500, "#ff4d4d"), mt: 2 }}>
                {error}
              </Typography>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default CustomerFileManager;