import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CustomToolbar from "../../components/CustomToolbar";
import { CheckCircleOutline, EditOutlined, ShareOutlined } from "@mui/icons-material";
import API from '../../api/api';

const WorkList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [workItems, setWorkItems] = useState([]);
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
        
        const response = await API.get("/getallwork", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const workData = response.data.works.map((work, index) => ({
          id: work._id,
          Sn: index + 1,  // Add the serial number based on index
          customerName: work.customer?.customerName || "Unknown Customer",
          customerEmail: work.customer?.email || "-",
          assignedEmployee: work.assignedEmployee?.name || "-",
          employeeEmail: work.assignedEmployee?.email || "-",
          service: work.service,
          workType: work.workType,
          month: work.month,
          quarter: work.quarter,
          financialYear: work.financialYear,
          price: work.price,
          quantity: work.quantity,
          discount: work.discount,
          currentStatus: work.currentStatus || "-"
        }));

        setWorkItems(workData);
      } catch (err) {
        setError("Failed to fetch work data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleFinish = (id) => {
    console.log(`Finish clicked for Row ID: ${id}`);
    // Add your finish logic here
  };

  const handleEdit = (id) => {
    console.log(`Edit clicked for Row ID: ${id}`);
    // Add your edit logic here
  };

  const handleShare = (id) => {
    console.log(`Share clicked for Row ID: ${id}`);
    // Add your share logic here
  };

  const columns = [
    { field: "Sn", headerName: "Sn", flex: .2 },
    { field: "customerName", headerName: "Customer Name", flex: 1 },
    // { field: "customerEmail", headerName: "Customer Email", flex: 1 },
    { field: "assignedEmployee", headerName: "Assigned Employee", flex: 1 },
    // { field: "employeeEmail", headerName: "Employee Email", flex: 1 },
    // { field: "service", headerName: "Service", flex: 1 },
    { field: "workType", headerName: "Work Type", flex: 1 },
    // { field: "month", headerName: "Month", flex: 1 },
    // { field: "quarter", headerName: "Quarter", flex: 1 },
    { field: "financialYear", headerName: "Financial Year", flex: 1 },
    { field: "price", headerName: "Price", flex: 1 },
    { field: "quantity", headerName: "Quantity", flex: 1 },
    { field: "discount", headerName: "Discount", flex: 1 },
    { field: "currentStatus", headerName: "Current Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1} justifyContent="center">
          <IconButton size="small" color="primary" onClick={() => handleFinish(params.row.id)}>
            <CheckCircleOutline />
          </IconButton>
          <IconButton size="small" color="secondary" onClick={() => handleEdit(params.row.id)}>
            <EditOutlined />
          </IconButton>
          <IconButton size="small" color="success" onClick={() => handleShare(params.row.id)}>
            <ShareOutlined />
          </IconButton>
        </Box>
      ),
    },
  ];

  if (loading) return <p>Loading work items...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <Box
      display="flex"
      sx={{
        height: "67vh",
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .MuiDataGrid-columnHeader": { backgroundColor: colors.primary[900], borderBottom: "none" },
        "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.bgc[100] },
        "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.primary[900] },
      }}
    >
      <DataGrid
       disableColumnMenu slots={{ toolbar: CustomToolbar }}
        rows={workItems}
        columns={columns}
      />
    </Box>
  );
};

export default WorkList;
