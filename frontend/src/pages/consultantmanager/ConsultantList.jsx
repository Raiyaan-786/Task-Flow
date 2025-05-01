import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Button,
  Grid2,
  IconButton,
  Modal,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import { tokens } from "../../theme";
import CustomToolbar from "../../components/CustomToolbar";
import {
  CheckCircle,
  CloseOutlined,
  Delete,
  Edit,
  NoAccounts,
  Visibility,
} from "@mui/icons-material";
import API from "../../api/api";
import Header from "../../components/Header";

const ConsultantList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [consultants, setConsultants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedConsultant, setSelectedConsultant] = useState(null);
  const [editConsultantData, setEditConsultantData] = useState(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);

  useEffect(() => {
    const fetchConsultants = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/getallconsultants", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const consultantsData = response.data.consultants || [];
        setConsultants(
          consultantsData.map((item, index) => ({ id: index + 1, ...item }))
        );
        console.log(consultantsData);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch consultants");
      } finally {
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  const handleView = (consultantId) => {
    const consultant = consultants.find((c) => c._id === consultantId);
    setSelectedConsultant(consultant);
    setOpenViewModal(true);
  };

  const handleEditClick = (consultantId) => {
    const consultant = consultants.find((c) => c._id === consultantId);
    setEditConsultantData(consultant);
    setOpenEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await API.put(
        `/consultant/${editConsultantData._id}`,
        editConsultantData
      );
      setConsultants(
        consultants.map((c) =>
          c._id === editConsultantData._id ? editConsultantData : c
        )
      );
      setOpenEditModal(false);
    } catch (err) {
      setError("Failed to save consultant details");
    }
  };

  const handleApprove = (id) => {
    console.log(`Approved consultant with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Deleted consultant with ID: ${id}`);
  };
  const formatDate = (date) => {
    if (typeof date !== "string" || !Date.parse(date)) return "Invalid Date";
    return new Date(date).toLocaleString();
  };

  const columns = [
    {
      field: "id",
      headerName: "S.No",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    { field: "consultantName", headerName: "Name", flex: 1.5 },
    { field: "mobile", headerName: "Mobile", flex: 1 },
    { field: "email", headerName: "Email", flex: 2 },
    { field: "address", headerName: "Address", flex: 2 },
    { field: "bankAccountNumber", headerName: "Account No", flex: 1 },
    { field: "bankIFSCCode", headerName: "IFSC Code", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Tooltip title="View">
            <IconButton
              aria-label="view"
              onClick={() => handleView(params.row._id)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>

          <Tooltip title="Edit">
            <IconButton
              aria-label="edit"
              onClick={() => handleEditClick(params.row._id)}
            >
              <Edit />
            </IconButton>
          </Tooltip>

          <Tooltip title="Mute">
            <IconButton onClick={() => handleDelete(params.row._id)}>
              <NoAccounts />
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
        loading={loading}
        slotProps={{
          loadingOverlay: { variant: "skeleton", noRowsVariant: "skeleton" },
        }}
        disableColumnMenu
        slots={{ toolbar: CustomToolbar }}
        rows={consultants}
        columns={columns}
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
      {/* view consultant modal */}
      <Modal
        open={openViewModal}
        onClose={() => setOpenViewModal(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{ width: 450, bgcolor: "white", borderRadius: 2, boxShadow: 3 }}
        >
          {/* Header Bar */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              bgcolor: colors.teal[300],
              color: "white",
              p: 1.5,
              borderTopLeftRadius: 7,
              borderTopRightRadius: 7,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Consultant Details
            </Typography>
            <IconButton
              onClick={() => setOpenViewModal(false)}
              sx={{ color: "white" }}
            >
              <CloseOutlined />
            </IconButton>
          </Box>

          {/* Customer Data Grid */}
          {selectedConsultant && (
            <Box sx={{ padding: 3 }}>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 2,
                }}
              >
                {/* Left Column */}

                <Box>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Consultant Name
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>Username</Typography>
                  <Typography sx={{ fontWeight: "bold" }}>Email</Typography>
                  <Typography sx={{ fontWeight: "bold" }}>Mobile No</Typography>
                  <Typography sx={{ fontWeight: "bold" }}>Address</Typography>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Account Holder Name
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Bank IFSC Code
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Bank Account Number
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Created At
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>
                    Updated At
                  </Typography>
                  <Typography sx={{ fontWeight: "bold" }}>Status</Typography>
                </Box>
                {/* Right Column */}
                <Box>
                  <Typography>
                    {selectedConsultant.consultantName || "No Data"}
                  </Typography>
                  <Typography>
                    {selectedConsultant.username || "No Data"}
                  </Typography>
                  <Typography>
                    {selectedConsultant.email || "No Data"}
                  </Typography>
                  <Typography>
                    {selectedConsultant.mobile || "No Data"}
                  </Typography>
                  <Typography>
                    {selectedConsultant.address || "No Data"}
                  </Typography>
                  <Typography>
                    {selectedConsultant.accountHolderName || "No Data"}
                  </Typography>
                  <Typography>
                    {selectedConsultant.bankIFSCCode || "No Data"}
                  </Typography>
                  <Typography>
                    {selectedConsultant.bankAccountNumber || "No Data"}
                  </Typography>
                  <Typography>
                    {formatDate(selectedConsultant.createdAt) || "No Data"}
                  </Typography>
                  <Typography>
                    {formatDate(selectedConsultant.updatedAt) || "No Data"}
                  </Typography>
                  <Typography>
                    {selectedConsultant.status || "No Data"}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </Modal>

      {/* edit consultant modal */}
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
            borderRadius: 2,
            bgcolor: colors.bgc[100],
          }}
        >
          <Header title={"Edit Customer"} />
          {editConsultantData && (
            <Grid2
              container
              spacing={2}
              gap={2}
              padding={"10px 20px"}
              color={colors.grey[200]}
            >
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>CONSULTANT NAME</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editConsultantData.consultantName}
                  variant="filled"
                  onChange={(e) =>
                    setEditConsultantData({
                      ...editConsultantData,
                      consultantName: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>USERNAME</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editConsultantData.username}
                  variant="filled"
                  onChange={(e) =>
                    setEditConsultantData({
                      ...editConsultantData,
                      username: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>EMAIL</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editConsultantData.email}
                  variant="filled"
                  onChange={(e) =>
                    setEditConsultantData({
                      ...editConsultantData,
                      email: e.target.value,
                    })
                  }
                  type="email"
                  fullWidth
                />
              </Grid2>

              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>MOBILE</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editConsultantData.mobile}
                  variant="filled"
                  onChange={(e) =>
                    setEditConsultantData({
                      ...editConsultantData,
                      mobile: e.target.value,
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
                <label>ADDRESS</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editConsultantData.address}
                  multiline
                  minRows={3}
                  maxRows={3}
                  variant="filled"
                  onChange={(e) =>
                    setEditConsultantData({
                      ...editConsultantData,
                      address: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid2>

              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>ACCOUNT HOLDER NAME</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editConsultantData.accountHolderName}
                  variant="filled"
                  onChange={(e) =>
                    setEditConsultantData({
                      ...editConsultantData,
                      accountHolderName: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>BANK IFSC CODE</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editConsultantData.bankIFSCCode}
                  variant="filled"
                  onChange={(e) =>
                    setEditConsultantData({
                      ...editConsultantData,
                      bankIFSCCode: e.target.value,
                    })
                  }
                  fullWidth
                />
              </Grid2>
              <Grid2 size={6} display={"flex"} alignItems={"center"}>
                <label>BANK ACCOUNT NUMBER</label>
              </Grid2>
              <Grid2 size={6}>
                <TextField
                  value={editConsultantData.bankAccountNumber}
                  variant="filled"
                  onChange={(e) =>
                    setEditConsultantData({
                      ...editConsultantData,
                      bankAccountNumber: e.target.value,
                    })
                  }
                  fullWidth
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
    </Box>
  );
};

export default ConsultantList;
