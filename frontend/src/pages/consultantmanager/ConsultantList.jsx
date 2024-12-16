import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CustomToolbar from "../../components/CustomToolbar";
import { CheckCircle, Delete } from "@mui/icons-material";
import API from "../../api/api";

const ConsultantList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [consultants, setConsultants] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
        setConsultants(consultantsData.map((item, index) => ({ id: index + 1, ...item })));
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch consultants");
        setLoading(false);
      }
    };

    fetchConsultants();
  }, []);

  const handleApprove = (id) => {
    console.log(`Approved consultant with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Deleted consultant with ID: ${id}`);
  };

  if (error) return <p>Error: {error}</p>;

  const columns = [
    { field: "id", headerName: "S.No", flex: 0.5, headerAlign: "center", align: "center" },
    { field: "consultantName", headerName: "Name", flex: 1.5},
    { field: "mobile", headerName: "Mobile", flex: 1},
    { field: "email", headerName: "Email", flex: 2},
    { field: "address", headerName: "Address", flex: 2},
    { field: "bankAccountNumber", headerName: "Account No", flex: 1},
    { field: "bankIFSCCode", headerName: "IFSC Code", flex: 1},
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Box display="flex" justifyContent="center">
          <IconButton onClick={() => handleApprove(params.row.id)} color="primary">
            <CheckCircle />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <Delete />
          </IconButton>
        </Box>
      ),
    },
  ];

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
       loading={loading}
       slotProps={{ loadingOverlay: { variant: 'skeleton', noRowsVariant: 'skeleton' } }}
       disableColumnMenu slots={{ toolbar: CustomToolbar }} rows={consultants} columns={columns} />
    </Box>
  );
};

export default ConsultantList;
