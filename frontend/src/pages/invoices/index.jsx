import { Box, Container, Typography, useTheme } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import { mockDataInvoices } from "../../data/mockData";
import Header from "../../components/Header";

const Invoices = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const columns = [
    { field: "id", headerName: "ID",flex:1 },
    {
      field: "name",
      headerName: "Name",
      flex: 1,
     
      cellClassName: "name-column--cell",
    },
    {
      field: "phone",
      headerName: "Phone Number",
      flex: 1,
    
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,

    },
    {
      field: "cost",
      headerName: "Cost",
      flex: 1,
      renderCell: (params) => (
        <Typography color={colors.teal[500]} component={'span'} >
          ${params.row.cost}
        </Typography>
      ),
    },
    {
      field: "date",
      headerName: "Date",
      flex: 1,
    },
  ];

  return (
    <Box p={2} sx={{m:'20px'}}  >
      <Header title="INVOICES" subtitle="List of Invoice Balances" />
      <Box
        height={'65vh'}
        m="40px 0 0 0"
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
           
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "none",
          },
          "& .name-column--cell": {
            color: colors.teal[500],
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: colors.primary[900],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[700],
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: colors.primary[900],
          },
          "& .MuiCheckbox-root": {
            color: `${colors.teal[200]} !important`,
          },
        }}
      >
        <DataGrid slots={{ toolbar: GridToolbar }} checkboxSelection rows={mockDataInvoices} columns={columns} scrollbarSize={0}/>
      </Box>
    </Box>
  );
};

export default Invoices;