import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Avatar, Box, Typography, useTheme } from "@mui/material";
import {
  AdminPanelSettingsOutlined,
  LockOpenOutlined,
  SecurityOutlined,
} from "@mui/icons-material";
import { tokens } from "../../theme";
import API from "../../api/api";
import CustomToolbar from "../../components/CustomToolbar";

const EmployeeDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  // State for storing fetched data
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No authentication token found. Please log in.");
          setLoading(false);
          return;
        }

        // Fetch data from your backend API
        const response = await API.get("/employeedashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response);
        // Map fetched data to rows
        const fetchedRows = response.data.map((work) => ({
          id: work._id,
          name: work.name,
          image: work.image || "/default-avatar.png", //isko dekhna padega
          access: work.role,
          totalWorks: work.workCounts.total,
          workDone: work.workCounts.done,
          assignedWork: work.workCounts.assigned,
          pickedUp: work.workCounts.pickedUp,
          customerVerification: work.workCounts.customerVerification,
          readyForChecking: work.workCounts.readyForChecking,
          holdWork: work.workCounts.holdWork,
          evcPending: work.workCounts.evcPending,
          cancel: work.workCounts.cancel,
        }));

        setRows(fetchedRows);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.error || "Failed to fetch data");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1.5,
      cellClassName: "name-column--cell",
      renderCell: (params) => (
        <Box
          display={"flex"}
          alignItems={"center"}
          gap={2}
          p={1}
          height={"100%"}
        >
          <Avatar
            src={params.row.image}
            sx={{ width: "28px", height: "28px" }}
          />
          <Typography variant="body1">{params.row.name}</Typography>
        </Box>
      ),
    },
    {
      field: "access",
      headerName: "Access Level",
      headerAlign: "center",
      flex: 1.4,
      align: "center",
      renderCell: ({ row: { access } }) => {
        return (
          <Box
            boxShadow={1}
            width="100px"
            m="10px auto"
            p="5px"
            display="flex"
            justifyContent="center"
            backgroundColor={
              access === "Admin"
                ? colors.blueHighlight[900]
                : access === "Manager"
                ? colors.blueHighlight[600]
                : colors.blueHighlight[300]
            }
            color={"white"}
            borderRadius="4px"
          >
            {access === "Admin" && <AdminPanelSettingsOutlined />}
            {access === "Manager" && <SecurityOutlined />}
            {access === "Employee" && <LockOpenOutlined />}
            <Typography color={"white"} sx={{ ml: "5px" }}>
              {access}
            </Typography>
          </Box>
        );
      },
    },
    {
      field: "totalWorks",
      headerName: "Total Works",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "workDone",
      headerName: "Works Done",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "assignedWork",
      headerName: "Assigned Work",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "pickedUp",
      headerName: "Picked Up",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "customerVerification",
      headerName: "Customer Verification",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "readyForChecking",
      headerName: "Ready For Checking",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "holdWork",
      headerName: "Hold Work",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "evcPending",
      headerName: "EVC Pending",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "cancel",
      headerName: "Cancel",
      type: "number",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ];

  if (error) return <Typography>Error: {error}</Typography>;

  return (
    <Box
      display={"flex"}
      sx={{
        height: "98%",
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
        loading={loading}
        slotProps={{
          loadingOverlay: { variant: "skeleton", noRowsVariant: "skeleton" },
        }}
        disableColumnMenu
        slots={{ toolbar: CustomToolbar }}
        rows={rows}
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
    </Box>
  );
};

export default EmployeeDashboard;
