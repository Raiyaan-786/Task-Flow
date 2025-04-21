import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import CustomToolbar from "../../components/CustomToolbar";
import API from "../../api/api";

const WorkDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [workSummary, setWorkSummary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWorkSummary = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/workdashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedData = response.data.map((item, index) => ({
          id: index, // Using index as ID, baad me dekhte hain isko
          workName: item.workType,
          totalWorks: item.totalWorks,
          workDone: item.worksDone,
          assignedWork: item.assignedWork,
          pickedUp: item.pickedUp,
          customerVerification: item.customerVerification,
          readyForChecking: item.readyForChecking,
          holdWork: item.holdWork,
          evcPending: item.evcPending,
          cancel: item.cancel,
        }));
        setWorkSummary(fetchedData);
      } catch (err) {
        console.error("Error fetching work summary:", err);
        setError("Failed to fetch work summary. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchWorkSummary();
  }, []);

  const columns = [
    {
      field: "workName",
      headerName: "Work Name",
      headerAlign: "center",
      flex: 1.5,
      renderCell: (params) => (
        <Box
          sx={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            variant="h6"
            bgcolor={colors.blueHighlight[800]}
            sx={{
              width: "100%",
              textAlign: "center",
              height: "80%",
              borderRadius: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            {params.row.workName}
          </Typography>
        </Box>
      ),
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

  if (error) return <div>Error: {error}</div>;

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
        rows={workSummary}
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

export default WorkDashboard;
