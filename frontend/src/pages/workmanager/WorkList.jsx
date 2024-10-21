import React, { useState ,useEffect} from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, IconButton, useTheme } from "@mui/material";
import { tokens } from "../../theme";
import { mockDataWorkList } from "../../data/mockData";
import CustomToolbar from "../../components/CustomToolbar";
import {
  CheckCircleOutline,
  EditOutlined,
  ShareOutlined,
} from "@mui/icons-material";
import API from '../../api/api';

const WorkList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [data, setData] = useState(mockDataWorkList); // State to hold filtered data

  const [workItems, setWorkItems] = useState([]); // State to hold work data
  const [customers, setCustomers] = useState([]); // State to hold customer data
  const [loading, setLoading] = useState(true); // State to track loading status
  const [error, setError] = useState(""); // State to track error messages

  // Fetch customers on component mount
  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/getallcustomers", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
          },
        });

        const customerData = response.data.customers || []; // Fallback to empty array
        setCustomers(customerData); // Set the customers state
        console.log("Fetched Customers:", customerData); // Log fetched customers
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch customers"); // Handle error
        console.log(err);
      }
    };

    fetchCustomers(); // Fetch customers on component mount
  }, []);

  // Fetch work items on component mount
  useEffect(() => {
    const fetchWorkItems = async () => {
      const token = localStorage.getItem("token"); // Get token from localStorage

      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await API.get("/getallwork", {
          headers: {
            Authorization: `Bearer ${token}`, // Include token in request headers
          },
        });

        const workData = response.data.works || []; // Fallback to empty array
        setWorkItems(workData); // Set the work state
        console.log("Fetched Work Items:", workData); // Log fetched work items
        setLoading(false); // Set loading to false
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch work items"); // Handle error
        console.log(err);
        setLoading(false); // Set loading to false
      }
    };

    fetchWorkItems(); // Fetch work items on component mount
  }, []);

  if (loading) {
    return <p>Loading work items...</p>; // Show loading message
  }

  if (error) {
    return <p>Error: {error}</p>; // Show error message
  }
  console.log(workItems)

  // Function to get customer name by ID
  const getCustomerNameById = (customerId) => {
    const customer = customers.find((c) => c._id === customerId);
    console.log("Customer ID:", customerId, "Found Customer:", customer); // Log the search process
    return customer ? customer.customerName : "Unknown Customer"; // Return customer name or fallback
  };

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
    { field: "Sn", headerName: "Sn", flex: 0.5 },
    {
      field: "action",
      headerName: "Action",
      headerAlign: "center",
      align: "center",
      flex: 1,
      renderCell: (params) => (
        <Box display="flex" gap={1} justifyContent="center">
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleFinish(params.row.id)}
          >
            <CheckCircleOutline />
          </IconButton>
          <IconButton
            size="small"
            color="secondary"
            onClick={() => handleEdit(params.row.id)}
          >
            <EditOutlined />
          </IconButton>
          <IconButton
            size="small"
            color="success"
            onClick={() => handleShare(params.row.id)}
          >
            <ShareOutlined />
          </IconButton>
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "work",
      headerName: "Work",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "name",
      headerName: "Name",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "mobile",
      headerName: "Mobile (Indian)",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "date",
      headerName: "Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "modifyDate",
      headerName: "Modify Date",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "assign",
      headerName: "Assign",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "Remark",
      headerName: "Remark",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "Reminder",
      headerName: "Reminder",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
    {
      field: "fy",
      headerName: "Financial Year",
      headerAlign: "center",
      align: "center",
      flex: 1,
    },
  ];

  return (
    <Box
      display={"flex"}
      sx={{
        height: "67vh",
        "& .MuiDataGrid-root": { border: "none" },
        "& .MuiDataGrid-cell": { borderBottom: "none" },
        "& .MuiDataGrid-columnHeader": {
          backgroundColor: colors.primary[900],
          borderBottom: "none",
        },
        "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.bgc[100] },
        "& .MuiDataGrid-footerContainer": {
          borderTop: "none",
          backgroundColor: colors.primary[900],
        },
        "& .MuiCheckbox-root": { color: `${colors.teal[200]} !important` },
      }}
    >
      <DataGrid
        disableColumnMenu
        slots={{ toolbar: CustomToolbar }}
        rows={data} // Use the filtered data
        columns={columns}
      />
    </Box>
  );
};

export default WorkList;
