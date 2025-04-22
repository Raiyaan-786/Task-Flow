import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import {
  Box,
  Alert,
  useTheme,
  Typography,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  Modal,
  Autocomplete,
  Button,
  TextField,
} from "@mui/material";
import { tokens } from "../../../theme";
import API from "../../../api/api";
import CustomToolbar from "../../../components/CustomToolbar";
import { Delete, Edit, HowToReg } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const MutedWorks = () => {
  const navigate = useNavigate();

  const handleEditClick = (workId) => {
    navigate(`/edit-work/${workId}`); // Navigate to EditWorkPage with workId as a URL parameter
  };

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [openModal, setOpenModal] = useState(false);
  const [selectedWorkId, setSelectedWorkId] = useState(null);
  const [employeeList, setEmployeeList] = useState([]); // Store employee options
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [columnVisibilityModel, setColumnVisibilityModel] = useState(() => {
    const savedModel = localStorage.getItem("columnVisibilityModel");
    return savedModel
      ? JSON.parse(savedModel)
      : {
          sn: true,
          name: true,
          billingName: false,
          createdAt: true,
          email: false,
          mobile: true,
          pan: false,
          address: false,
          service: true,
          workType: true,
          quantity: false,
          price: false,
          discount: false,
          financialYear: true,
          month: true,
          quarter: true,
          assignedEmployee: true,
          currentStatus: true,
        };
  });

  useEffect(() => {
    fetchEmployeesAndWorks();
  }, []);

  const fetchEmployeesAndWorks = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("No authentication token found. Please log in.");
      setLoading(false);
      return;
    }

    try {
      const [worksResponse, employeesResponse] = await Promise.all([
        API.get("/muted-works", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        API.get("/auth/allusers", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      const employeeOptions = employeesResponse.data.users.map((emp) => ({
        label: emp.name,
        value: emp._id,
      }));

      setEmployeeList(employeeOptions);

      const mappedWorks = worksResponse.data.map((work, index) => ({
        ...work,
        sn: index + 1,
        assignedEmployee: work.assignedEmployee?.name || "Not Assigned",
        name: work.customer?.customerName,
        createdAt: formatDate(work.createdAt),
      }));

      setWorks(mappedWorks);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch data");
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (typeof date !== "string" || !Date.parse(date)) return "Invalid Date";
    return new Date(date).toLocaleString();
  };

  const handleColumnVisibilityChange = (newModel) => {
    setColumnVisibilityModel(newModel);
    localStorage.setItem("columnVisibilityModel", JSON.stringify(newModel));
  };

  const handleStatusChange = async (workId, newStatus) => {
    console.log(workId);
    console.log(typeof newStatus);
    const token = localStorage.getItem("token");
    try {
      await API.put(
        `/updateworkstatus/${workId}`,
        { newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await fetchEmployeesAndWorks();
    } catch (error) {
      setError("Failed to update status");
    }
  };

  //code for delete
  const handleDeleteWork = async () => {
    const token = localStorage.getItem("token");
    try {
      await API.delete(`/deletework/${selectedWorkId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Update local state to remove the deleted work
      setWorks((prevWorks) =>
        prevWorks.filter((work) => work._id !== selectedWorkId)
      );
      setDeleteModalOpen(false);
    } catch (error) {
      setError("Failed to delete work");
    }
  };

  const handleOpenDeleteModal = (workId) => {
    setSelectedWorkId(workId);
    setDeleteModalOpen(true);
  };

  const handleCloseDeleteModal = () => {
    setDeleteModalOpen(false);
    setSelectedWorkId(null);
  };

  if (error) return <Alert severity="error">{error}</Alert>;

  const columns = [
    {
      field: "sn",
      headerName: "Sn",
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    { field: "name", headerName: "Name", flex: 1.5 },
    { field: "billingName", headerName: "Billing Name", flex: 1.5 },
    { field: "createdAt", headerName: "Created At", flex: 1.5 },
    { field: "email", headerName: "Email", flex: 1.5 },
    { field: "mobile", headerName: "Mobile", flex: 1.5 },
    { field: "pan", headerName: "PAN", flex: 1.5 },
    { field: "address", headerName: "Address", flex: 1.5 },
    { field: "service", headerName: "Service", flex: 1.5 },
    { field: "workType", headerName: "Work Type", flex: 1.5 },
    { field: "quantity", headerName: "Quantity", flex: 0.5 },
    { field: "price", headerName: "Price", flex: 1.5 },
    { field: "discount", headerName: "Discount", flex: 1.5 },
    { field: "financialYear", headerName: "Financial Year", flex: 1.5 },
    { field: "month", headerName: "Month", flex: 1 },
    { field: "quarter", headerName: "Quarter", flex: 0.1 },
    { field: "assignedEmployee", headerName: "Assigned Employee", flex: 1.5 },
    {
      field: "currentStatus",
      headerName: "Current Status",
      flex: 2,
      renderCell: ({ row: { currentStatus, _id } }) => (
        <Box
               height={"100%"}
               display="flex"
               justifyContent="center"
               alignItems={"center"}
             >
               <FormControl fullWidth size="small" variant="outlined">
                 <Select
                   inputProps={{ "aria-label": "Without label" }}
                   sx={{
                     bgcolor: colors.blueHighlight[900],
                     color: "white",
                     "& .MuiSvgIcon-root": {
                       color: "white", // Sets the dropdown icon color to white
                     },
                     "& .MuiOutlinedInput-notchedOutline": {
                       borderColor: "transparent", // Removes the default border
                     },
                     "&:hover .MuiOutlinedInput-notchedOutline": {
                       borderColor: "transparent", // Removes the hover border
                     },
                     "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                       borderColor: "transparent", // Removes the focus outline
                     },
                     "& .MuiSelect-select:focus": {
                       backgroundColor: "transparent", // Prevents background change on focus
                     },
                   }}
                   displayEmpty
                   value={currentStatus}
                   onChange={(e) => handleStatusChange(_id, e.target.value)}
                 >
                   {[
                     "Assigned",
                     "Picked Up",
                     "Customer Verification",
                     "Ready for Checking",
                     "Hold Work",
                     "EVC Pending",
                     "Cancel",
                     "Completed",
                     "Mute",
                   ].map((status) => (
                     <MenuItem key={status} value={status}>
                       {status}
                     </MenuItem>
                   ))}
                 </Select>
               </FormControl>
             </Box>
      ),
    },
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
          sx={{
            height: "100%",
            width: "100%",
          }}
        >
          <IconButton
            aria-label="delete-work"
            onClick={() => handleOpenDeleteModal(row._id)}
          >
            <Delete color="error" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <>
       <Box
              display="flex"
              sx={{
                height: "92%",
                "& .MuiDataGrid-root": { border: "none" },
                "& .MuiDataGrid-cell": { borderBottom: "none" },
                // '& .name-column--cell': { color: colors.blueHighlight[900] },
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: colors.foreground[100],
                },
                "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.bgc[100] },
                "& .MuiDataGrid-footerContainer": {
                  backgroundColor: colors.foreground[100],
                },
                "& .MuiCheckbox-root": {
                  color: `${colors.blueAccent[900]} !important`,
                },
              }}
            >
        <DataGrid
          rows={works}
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
      </Box>
      {/* Delete Confirmation Modal */}
      <Modal open={deleteModalOpen} onClose={handleCloseDeleteModal}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 3,
            width: "300px",
            borderRadius: "10px",
          }}
        >
          <Typography variant="h6" mb={2}>
            Are you sure you want to delete this work?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button onClick={handleCloseDeleteModal}>Cancel</Button>
            <Button
              color="error"
              variant="contained"
              onClick={handleDeleteWork}
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default MutedWorks;
