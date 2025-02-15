import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedContact } from "../../features/chatSlice";
import API from "../../api/api";

const SidebarForChat = () => {
  const dispatch = useDispatch();
  const selectedContact = useSelector((state) => state.chat.selectedContact);

  const [openSections, setOpenSections] = useState({
    admins: true,
    managers: false,
    employees: false,
    customers: false,
    others: false,
  });

  const [customers, setCustomers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [managers, setManagers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [others, setOthers] = useState([]);

  // Retrieve logged-in user from localStorage
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const loggedInUserId = loggedInUser?._id;

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await API.get("/getallcustomers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Exclude the logged-in user from the customers list
        setCustomers(response.data.customers.filter((customer) => customer._id !== loggedInUserId));
      } catch (err) {
        console.log("Error fetching customers:", err);
      }
    };

    fetchCustomers();
  }, [loggedInUserId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await API.get("/auth/allusers", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const allUsers = response.data.users.filter((user) => user._id !== loggedInUserId); // Exclude logged-in user

        setAdmins(allUsers.filter((user) => user.role === "Admin"));
        setManagers(allUsers.filter((user) => user.role === "Manager"));
        setEmployees(allUsers.filter((user) => user.role === "Employee"));
        setOthers(
          allUsers.filter(
            (user) =>
              user.role !== "Admin" &&
              user.role !== "Manager" &&
              user.role !== "Employee"
          )
        );
      } catch (err) {
        console.log("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [loggedInUserId]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSelectContact = (contact) => {
    dispatch(setSelectedContact(contact));
  };

  return (
    <Box
      sx={{
        width: 280,
        borderRight: "1px solid #ccc",
        height: "100vh",
        overflowY: "auto",
      }}
    >
      <List>
        {/* Admins Section */}
        <ListItemButton onClick={() => toggleSection("admins")}>
          <ListItemText primary="Admins" />
          {openSections.admins ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSections.admins} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {admins.map((admin) => (
              <ListItemButton
                key={admin._id}
                sx={{ pl: 4 }}
                onClick={() => handleSelectContact(admin)}
                selected={selectedContact?._id === admin._id}
              >
                <ListItemText primary={admin.name} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        {/* Managers Section */}
        <ListItemButton onClick={() => toggleSection("managers")}>
          <ListItemText primary="Managers" />
          {openSections.managers ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSections.managers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {managers.map((manager) => (
              <ListItemButton
                key={manager._id}
                sx={{ pl: 4 }}
                onClick={() => handleSelectContact(manager)}
                selected={selectedContact?._id === manager._id}
              >
                <ListItemText primary={manager.name} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        {/* Employees Section */}
        <ListItemButton onClick={() => toggleSection("employees")}>
          <ListItemText primary="Employees" />
          {openSections.employees ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSections.employees} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {employees.map((employee) => (
              <ListItemButton
                key={employee._id}
                sx={{ pl: 4 }}
                onClick={() => handleSelectContact(employee)}
                selected={selectedContact?._id === employee._id}
              >
                <ListItemText primary={employee.name} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        {/* Customers Section */}
        <ListItemButton onClick={() => toggleSection("customers")}>
          <ListItemText primary="Customers" />
          {openSections.customers ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSections.customers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {customers.map((customer) => (
              <ListItemButton
                key={customer._id}
                sx={{ pl: 4 }}
                onClick={() => handleSelectContact(customer)}
                selected={selectedContact?._id === customer._id}
              >
                <ListItemText primary={customer.customerName} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>

        {/* Others Section */}
        <ListItemButton onClick={() => toggleSection("others")}>
          <ListItemText primary="Others" />
          {openSections.others ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSections.others} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {others.map((other) => (
              <ListItemButton
                key={other._id}
                sx={{ pl: 4 }}
                onClick={() => handleSelectContact(other)}
                selected={selectedContact?._id === other._id}
              >
                <ListItemText primary={other.name} />
              </ListItemButton>
            ))}
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default SidebarForChat;
