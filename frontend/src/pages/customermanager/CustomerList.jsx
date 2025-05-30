import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid2,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  CloseOutlined,
  Edit,
  Visibility,
  UploadFile as UploadFileIcon,
  Visibility as VisibilityIcon,
  GetApp as DownloadIcon,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import API from "../../api/api";
import CustomToolbar from "../../components/CustomToolbar";
import Header from "../../components/Header";

const CustomerList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [firmNames, setFirmNames] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [editCustomerData, setEditCustomerData] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [files, setFiles] = useState({
    aadharCard: null,
    panCard: null,
  });
  const [documents, setDocuments] = useState({
    aadharCard: null,
    panCard: null,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const [columnVisibilityModel, setColumnVisibilityModel] = useState(() => {
    const savedModel = localStorage.getItem("columnVisibilityModel");
    return savedModel
      ? JSON.parse(savedModel)
      : {
          Sn: true,
          customerName: true,
          customerCode: true,
          billingName: true,
          customerCompanyName: true,
          email: true,
          mobileNo: true,
          whatsappNo: true,
          PAN: true,
          address: true,
          contactPersonName: true,
          contactPersonPhone: true,
          actions: true,
        };
  });

  const handleColumnVisibilityChange = (newModel) => {
    setColumnVisibilityModel(newModel);
    localStorage.setItem("columnVisibilityModel", JSON.stringify(newModel));
  };

  useEffect(() => {
    const fetchFirmNames = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await API.get("/companyNames", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFirmNames(response.data.firmNames || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch firm names");
        setSnackbarOpen(true);
      }
    };

    fetchFirmNames();
  }, []);

  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }
      try {
        const response = await API.get("/getallcustomers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const customersData = response.data.customers || [];
        console.log(customersData) ;
        const formattedData = customersData.map((customer, index) => ({
          id: customer._id,
          Sn: index + 1,
          ...customer,
        }));
        setCustomers(formattedData);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch customers");
        setSnackbarOpen(true);
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  const handleView = async (customerId) => {
    const customer = customers.find((c) => c._id === customerId);
    if (!customer) {
      setError("Customer not found");
      setSnackbarOpen(true);
      return;
    }
    setSelectedCustomer(customer);
    setFiles({ aadharCard: null, panCard: null });
    setDocuments({ aadharCard: null, panCard: null });

    // Fetch documents
    try {
      const response = await API.get(`/customer-documents/${customerId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const { data } = response.data;
      setDocuments({
        aadharCard: data?.aadharCard || null,
        panCard: data?.panCard || null,
      });
    } catch (err) {
      if (err.response?.status === 404) {
        // No documents found, set empty documents
        setDocuments({
          aadharCard: null,
          panCard: null,
        });
      } else {
        setError(err.response?.data?.message || "Failed to fetch documents");
        setSnackbarOpen(true);
      }
    }

    setOpenViewModal(true);
  };

  const handleEditClick = (customerId) => {
    const customer = customers.find((c) => c._id === customerId);
    setEditCustomerData(customer);
    setOpenEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await API.put(`/customer/${editCustomerData._id}`, editCustomerData);
      setCustomers(
        customers.map((c) =>
          c._id === editCustomerData._id ? editCustomerData : c
        )
      );
      setOpenEditModal(false);
    } catch (err) {
      setError("Failed to save customer details");
      setSnackbarOpen(true);
    }
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      setError("File size too large (max 10MB)");
      setSnackbarOpen(true);
      return;
    }

    // Validate file type
    const validDocTypes = ["image/jpeg", "image/png", "application/pdf"];
    if (
      (fileType === "aadharCard" || fileType === "panCard") &&
      !validDocTypes.includes(file.type)
    ) {
      setError(
        `${
          fileType === "aadharCard" ? "Aadhar" : "PAN"
        } card must be JPG, PNG, or PDF`
      );
      setSnackbarOpen(true);
      return;
    }

    setFiles((prev) => ({ ...prev, [fileType]: file }));
  };

  const handleUploadFiles = async () => {
    if (!selectedCustomer) return;

    if (!files.aadharCard && !files.panCard) {
      setError("No files selected for upload");
      setSnackbarOpen(true);
      return;
    }

    setIsUploading(true);
    try {
      const token = localStorage.getItem("token");
      const uploadPromises = [];

      if (files.aadharCard) {
        const formData = new FormData();
        formData.append("document", files.aadharCard);
        uploadPromises.push(
          API.post(
            `/customer-documents/upload/${selectedCustomer._id}/aadhar`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          )
        );
      }
      if (files.panCard) {
        const formData = new FormData();
        formData.append("document", files.panCard);
        uploadPromises.push(
          API.post(
            `/customer-documents/upload/${selectedCustomer._id}/pan`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "multipart/form-data",
              },
            }
          )
        );
      }

      const responses = await Promise.all(uploadPromises);
      const updatedDocuments = responses.reduce((acc, res) => {
        const { document } = res.data;
        const key = document.type === "aadhar" ? "aadharCard" : "panCard";
        acc[key] = document;
        return acc;
      }, {});

      setDocuments((prev) => ({ ...prev, ...updatedDocuments }));
      setFiles({ aadharCard: null, panCard: null });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload files");
      setSnackbarOpen(true);
    } finally {
      setIsUploading(false);
    }
  };

  const mimeTypeMap = {
    pdf: "application/pdf",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
  };

  const handleDownload = async (fileUrl, fileName) => {
    setIsDownloading(true);
    try {
      let correctedUrl = fileUrl;
      if (fileName.endsWith(".pdf") && fileUrl.includes("/image/upload")) {
        correctedUrl = fileUrl.replace("/image/upload", "/raw/upload");
      }

      const response = await fetch(correctedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const contentType =
        response.headers.get("Content-Type") || "application/octet-stream";
      const fileExtension = fileName?.split(".").pop()?.toLowerCase();
      const mimeType = mimeTypeMap[fileExtension] || contentType;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: mimeType })
      );

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      setError("Download failed. Please try again.");
      setSnackbarOpen(true);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleViewFile = (fileUrl, fileName) => {
    let correctedUrl = fileUrl;
    if (fileName.endsWith(".pdf") && fileUrl.includes("/image/upload")) {
      correctedUrl = fileUrl.replace("/image/upload", "/raw/upload");
    }
    window.open(correctedUrl, "_blank");
  };

  const columns = [
    {
      field: "Sn",
      headerName: "S.No",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    { field: "customerName", headerName: "Customer Name", flex: 1.5 },
    { field: "customerCode", headerName: "Customer Code", flex: 1 },
    { field: "billingName", headerName: "Billing Name", flex: 1.5 },
    { field: "customerCompanyName", headerName: "Company/Firm Name", flex: 1 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "mobileNo", headerName: "Mobile No", flex: 1 },
    { field: "whatsappNo", headerName: "WhatsApp No", flex: 1 },
    { field: "PAN", headerName: "PAN", flex: 1 },
    { field: "address", headerName: "Address", flex: 2 },
    { field: "contactPersonName", headerName: "Contact Person Name", flex: 1 },
    { field: "contactPersonPhone", headerName: "Contact Person Phone", flex: 1 },
    {
      field: "actions",
      flex: 1.5,
      headerName: "Actions",
      headerAlign: "center",
      align: "center",
      renderCell: ({ row }) => (
        <Box
          display={"flex"}
          justifyContent={"space-evenly"}
          alignItems={"center"}
          sx={{ height: "100%", width: "100%" }}
        >
          <Tooltip title="View">
            <IconButton aria-label="view" onClick={() => handleView(row._id)}>
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton
              aria-label="edit"
              onClick={() => handleEditClick(row._id)}
            >
              <Edit />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box
      display="flex"
      sx={{
        height: "99%",
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        // '& .name-column--cell': { color: colors.blueHighlight[900] },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: colors.foreground[100],
        },
        "& .MuiDataGrid-virtualScroller": {
          backgroundColor: colors.bgc[100],
        },
        "& .MuiDataGrid-footerContainer": {
          backgroundColor: colors.foreground[100],
        },
        "& .MuiCheckbox-root": {
          color: `${colors.blueAccent[900]} !important`,
        },
      }}
    >
      <DataGrid
        rows={customers}
        columns={columns}
        columnVisibilityModel={columnVisibilityModel}
        onColumnVisibilityModelChange={handleColumnVisibilityChange}
        pageSize={10}
        loading={loading}
        slotProps={{
          loadingOverlay: { variant: "skeleton", noRowsVariant: "skeleton" },
        }}
        disableColumnMenu
        getRowId={(row) => row._id}
        slots={{ toolbar: CustomToolbar }}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "even-row" : "odd-row"
        }
        sx={{
          "& .even-row": {
            backgroundColor: colors.bgc[100], // Light shade (#e6f0ff)
          },
          "& .odd-row": {
            backgroundColor: colors.foreground[100], // Darker shade (#99baff)
          },
        }}
      />

      {/* View Customer Modal */}
      <Modal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            width: { xs: "90%", sm: 600 },
            maxWidth: 600,
            bgcolor: colors.bgc[100],
            borderRadius: 2,
            boxShadow: 3,
            overflow: "hidden", // Ensure header corners are not clipped
          }}
        >
          {selectedCustomer && (
            <>
              {/* Sticky Header */}
              <Box
                sx={{
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  bgcolor: colors.blueHighlight[900],
                  color: "white",
                  p: 1.5,
                  px: 2,
                  borderTopLeftRadius: 7,
                  borderTopRightRadius: 7,
                  width: "100%",
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                  Customer Details
                </Typography>
                <IconButton
                  onClick={() => setOpenViewModal(false)}
                  sx={{ color: "white" }}
                >
                  <CloseOutlined />
                </IconButton>
              </Box>

              {/* Scrollable Content */}
              <Box
                sx={{
                  p: 3,
                  maxHeight: "80vh",
                  overflowY: "auto",
                }}
              >
                {/* Personal Information Section */}
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: colors.grey[100], fontWeight: "bold" }}
                >
                  Personal Information
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1.5,
                    mb: 3,
                  }}
                >
                  {[
                    { label: "Name", value: selectedCustomer.customerName },
                    { label: "Code", value: selectedCustomer.customerCode },
                    { label: "Mobile No", value: selectedCustomer.mobileNo },
                    {
                      label: "WhatsApp No",
                      value: selectedCustomer.whatsappNo,
                    },
                    { label: "Email", value: selectedCustomer.email },
                    { label: "PAN", value: selectedCustomer.PAN },
                    { label: "Aadhaar No", value: selectedCustomer.AadharNo },
                    {
                      label: "Address",
                      value: selectedCustomer.address,
                      multiline: true,
                    },
                    {
                      label: "Company/Firm Name",
                      value: selectedCustomer.customerCompanyName,
                    },
                    {
                      label: "Billing Name",
                      value: selectedCustomer.billingName,
                    },
                    {
                      label: "Contact Person Name",
                      value: selectedCustomer.contactPersonName,
                    },
                    {
                      label: "Contact Person Phone",
                      value: selectedCustomer.contactPersonPhone,
                    },
                  ].map(({ label, value, multiline }) => (
                    <Box
                      key={label}
                      sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          width: 180,
                          fontWeight: "bold",
                          color: colors.grey[200],
                          flexShrink: 0,
                          pt: multiline ? 0.5 : 0,
                        }}
                      >
                        {label}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: colors.grey[100],
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: multiline ? "normal" : "nowrap",
                          maxWidth: "100%",
                        }}
                      >
                        {value || "No Data"}
                      </Typography>
                    </Box>
                  ))}
                </Box>

                {/* Documents Section */}
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: colors.grey[100], fontWeight: "bold" }}
                >
                  Documents
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    mb: 3,
                  }}
                >
                  {[
                    { label: "Aadhar Card", doc: documents.aadharCard },
                    { label: "PAN Card", doc: documents.panCard },
                  ].map(({ label, doc }) => (
                    <Box
                      key={label}
                      sx={{
                        p: 2,
                        border: `1px solid ${colors.grey[700]}`,
                        borderRadius: 1,
                        bgcolor: colors.primary[900],
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          width: 180,
                          fontWeight: "bold",
                          color: colors.grey[200],
                          flexShrink: 0,
                        }}
                      >
                        {label}
                      </Typography>
                      {doc ? (
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 2,
                            flex: 1,
                          }}
                        >
                          {doc.fileType === "image" ? (
                            <img
                              src={doc.url}
                              alt={label}
                              style={{
                                width: 80,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 4,
                              }}
                            />
                          ) : (
                            <Typography sx={{ color: colors.blueAccent[500] }}>
                              {label} (PDF)
                            </Typography>
                          )}
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<VisibilityIcon />}
                              onClick={() =>
                                handleViewFile(doc.url, doc.filename)
                              }
                              sx={{
                                color: colors.grey[100],
                                borderColor: colors.grey[500],
                                "&:hover": {
                                  borderColor: colors.teal[300],
                                  bgcolor: colors.teal[900],
                                },
                              }}
                            >
                              View
                            </Button>
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<DownloadIcon />}
                              onClick={() =>
                                handleDownload(doc.url, doc.filename)
                              }
                              disabled={isDownloading}
                              sx={{
                                color: colors.grey[100],
                                borderColor: colors.grey[500],
                                "&:hover": {
                                  borderColor: colors.teal[300],
                                  bgcolor: colors.teal[900],
                                },
                              }}
                            >
                              {isDownloading ? "Downloading..." : "Download"}
                            </Button>
                          </Box>
                        </Box>
                      ) : (
                        <Typography sx={{ color: colors.grey[400], flex: 1 }}>
                          No Document
                        </Typography>
                      )}
                    </Box>
                  ))}
                </Box>

                {/* Upload Documents Section */}
                <Typography
                  variant="h6"
                  sx={{ mb: 2, color: colors.grey[100], fontWeight: "bold" }}
                >
                  Upload Documents
                </Typography>
                <Box
                  sx={{
                    p: 2,
                    border: `1px solid ${colors.grey[700]}`,
                    borderRadius: 1,
                    bgcolor: colors.primary[900],
                  }}
                >
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                  >
                    {[
                      {
                        id: "aadharCard",
                        label: "Upload Aadhar Card",
                        accept: "image/jpeg,image/png,application/pdf",
                      },
                      {
                        id: "panCard",
                        label: "Upload PAN Card",
                        accept: "image/jpeg,image/png,application/pdf",
                      },
                    ].map(({ id, label, accept }) => (
                      <Box
                        key={id}
                        sx={{ display: "flex", alignItems: "center", gap: 2 }}
                      >
                        <input
                          type="file"
                          id={id}
                          accept={accept}
                          style={{ display: "none" }}
                          onChange={(e) => handleFileChange(e, id)}
                        />
                        <label htmlFor={id}>
                          <Button
                            variant="outlined"
                            component="span"
                            startIcon={<UploadFileIcon />}
                            disabled={isUploading}
                            sx={{
                              color: colors.grey[100],
                              borderColor: colors.grey[500],
                              "&:hover": {
                                borderColor: colors.teal[300],
                                bgcolor: colors.teal[900],
                              },
                            }}
                          >
                            {label}
                          </Button>
                        </label>
                        {files[id] && (
                          <Typography
                            variant="caption"
                            sx={{
                              color: colors.grey[300],
                              maxWidth: 200,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {files[id].name}
                          </Typography>
                        )}
                      </Box>
                    ))}
                    <Button
                      variant="contained"
                      onClick={handleUploadFiles}
                      disabled={
                        isUploading || (!files.aadharCard && !files.panCard)
                      }
                      sx={{
                        bgcolor: colors.teal[300],
                        "&:hover": { bgcolor: colors.teal[400] },
                        mt: 2,
                        alignSelf: "flex-start",
                      }}
                    >
                      {isUploading ? "Uploading..." : "Save Uploads"}
                    </Button>
                  </Box>
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        open={openEditModal}
        onClose={() => setOpenEditModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            padding: 2,
            width: "600px",
            height: "500px",
            overflow: "auto",
            margin: "auto",
            bgcolor: colors.bgc[100],
            borderRadius: 2,
          }}
        >
          <Header title={"Edit Customer"} />
          {editCustomerData && (
            <Grid2
              container
              spacing={2}
              gap={2}
              padding={"10px 20px"}
              color={colors.grey[200]}
            >
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>CUSTOMER NAME</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editCustomerData.customerName}
                  variant="filled"
                  onChange={(e) =>
                    setEditCustomerData({
                      ...editCustomerData,
                      customerName: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>CUSTOMER CODE</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editCustomerData.customerCode}
                  variant="filled"
                  onChange={(e) =>
                    setEditCustomerData({
                      ...editCustomerData,
                      customerCode: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>AADHAAR NUMBER</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editCustomerData.AadharNo}
                  variant="filled"
                  onChange={(e) =>
                    setEditCustomerData({
                      ...editCustomerData,
                      AadharNo: e.target.value,
                    })
                  }
                  type="number"
                  sx={{
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }}
                  fullWidth
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>BILLING NAME</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editCustomerData.billingName}
                  variant="filled"
                  onChange={(e) =>
                    setEditCustomerData({
                      ...editCustomerData,
                      billingName: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>MOBILE</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editCustomerData.mobileNo}
                  variant="filled"
                  onChange={(e) =>
                    setEditCustomerData({
                      ...editCustomerData,
                      mobileNo: e.target.value,
                    })
                  }
                  fullWidth
                  type="number"
                  sx={{
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }}
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>WHATSAPP NO.</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editCustomerData.whatsappNo}
                  variant="filled"
                  onChange={(e) =>
                    setEditCustomerData({
                      ...editCustomerData,
                      whatsappNo: editCustomerData.sameAsMobileNo
                        ? editCustomerData.mobileNo
                        : e.target.value,
                    })
                  }
                  fullWidth
                  type="number"
                  sx={{
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={editCustomerData.sameAsMobileNo}
                      onChange={(e) =>
                        setEditCustomerData({
                          ...editCustomerData,
                          sameAsMobileNo: e.target.checked,
                          whatsappNo: e.target.checked
                            ? editCustomerData.mobileNo
                            : editCustomerData.whatsappNo,
                        })
                      }
                    />
                  }
                  label="Same as Mobile"
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>ADDRESS</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editCustomerData.address}
                  multiline
                  minRows={3}
                  maxRows={3}
                  variant="filled"
                  onChange={(e) =>
                    setEditCustomerData({
                      ...editCustomerData,
                      address: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>COMPANY/FIRM NAME</label>
              </Grid2>
              <Grid2 size={6}>
                <Autocomplete
                  disablePortal
                  options={firmNames}
                  size="small"
                  freeSolo
                  value={editCustomerData.customerCompanyName}
                  onChange={(event, newValue) =>
                    setEditCustomerData({
                      ...editCustomerData,
                      companyName: newValue,
                    })
                  }
                  renderInput={(params) => (
                    <TextField
                      variant="filled"
                      {...params}
                      placeholder="ENTER COMPANY/FIRM NAME"
                    />
                  )}
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>CONTACT PERSON NAME</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editCustomerData.contactPersonName}
                  variant="filled"
                  onChange={(e) =>
                    setEditCustomerData({
                      ...editCustomerData,
                      contactPersonName: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>CONTACT PERSON PHONE</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editCustomerData.contactPersonPhone}
                  variant="filled"
                  onChange={(e) =>
                    setEditCustomerData({
                      ...editCustomerData,
                      contactPersonPhone: e.target.value,
                    })
                  }
                  fullWidth
                  type="number"
                  sx={{
                    "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button":
                      {
                        display: "none",
                      },
                    "& input[type=number]": {
                      MozAppearance: "textfield",
                    },
                  }}
                />
              </Grid2>
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                sx={{ bgcolor: colors.teal[300], marginTop: 2 }}
              >
                Save
              </Button>
              <Button
                onClick={() => setOpenEditModal(false)}
                variant="outlined"
                sx={{ color: colors.grey[300], marginTop: 2 }}
              >
                Cancel
              </Button>
            </Grid2>
          )}
        </Box>
      </Modal>

      {/* Snackbar for Errors */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert severity="error" onClose={() => setSnackbarOpen(false)}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomerList;
