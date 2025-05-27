import React, { useEffect, useState } from "react";
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Collapse,
  Typography,
  Avatar,
  ListItemAvatar,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedUser } from "../../features/authSlice";
import API from "../../api/api";

const SidebarForChat = () => {
  const dispatch = useDispatch();
  const selectedUser = useSelector((state) => state.auth.selectedUser);
  const { onlineUsers } = useSelector((state) => state.chat);

  const [openSections, setOpenSections] = useState({
    admins: true,
    managers: false,
    employees: false,
    customers: false,
    others: false,
  });

  const [users, setUsers] = useState({
    admins: [],
    managers: [],
    employees: [],
    customers: [],
    others: []
  });

  const loggedInUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token || !loggedInUser) return;

        // Fetch customers
        const customersRes = await API.get("/getallcustomers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredCustomers = customersRes.data.customers.filter(
          (customer) => customer._id !== loggedInUser._id
        );

        // Fetch other users
        const usersRes = await API.get("/auth/allusers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const filteredUsers = usersRes.data.users.filter(
          (user) => user._id !== loggedInUser._id
        );

        setUsers({
          customers: filteredCustomers,
          admins: filteredUsers.filter((user) => user.role === "Admin"),
          managers: filteredUsers.filter((user) => user.role === "Manager"),
          employees: filteredUsers.filter((user) => user.role === "Employee"),
          others: filteredUsers.filter(
            (user) =>
              !["Admin", "Manager", "Employee"].includes(user.role)
          ),
        });
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };

    fetchUsers();
  }, [loggedInUser]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleSelectContact = (user) => {
    dispatch(setSelectedUser(user));
  };

  const renderUserList = (users, isCustomer = false) => {
    return users.map((user) => (
      <ListItemButton
        key={user._id}
        sx={{ pl: 4,borderRadius:2 }}
        onClick={() => handleSelectContact(user)}
        selected={selectedUser?._id === user._id}
        
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar src={user.image} sx={{ width: 32, height: 32 }} />
          <ListItemText 
            primary={isCustomer ? user.customerName : user.name} 
            secondary={onlineUsers.includes(user._id) ? "Online" : "Offline"}
          />
        </Box>
      </ListItemButton>
    ));
  };

  return (
    <Box
      sx={{
        // width: 280,
        // borderRight: "1px solid #ccc",
        height: "100vh",
        // overflowY: "auto",
        // bgcolor:'red'
      }}
    >
     
      
      <List>
        {/* Admins Section */}
        <ListItemButton onClick={() => toggleSection("admins")}>
          <ListItemText primary={`Admins (${users.admins.length})`} />
          {openSections.admins ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSections.admins} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            
            {renderUserList(users.admins)}
          </List>
        </Collapse>
        

        {/* Managers Section */}
        <ListItemButton onClick={() => toggleSection("managers")}>
          <ListItemText primary={`Managers (${users.managers.length})`} />
          {openSections.managers ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSections.managers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderUserList(users.managers)}
          </List>
        </Collapse>

        {/* Employees Section */}
        <ListItemButton onClick={() => toggleSection("employees")}>
          <ListItemText primary={`Employees (${users.employees.length})`} />
          {openSections.employees ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSections.employees} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderUserList(users.employees)}
          </List>
        </Collapse>

        {/* Customers Section */}
        <ListItemButton onClick={() => toggleSection("customers")}>
          <ListItemText primary={`Customers (${users.customers.length})`} />
          {openSections.customers ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSections.customers} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderUserList(users.customers, true)}
          </List>
        </Collapse>

        {/* Others Section */}
        <ListItemButton onClick={() => toggleSection("others")}>
          <ListItemText primary={`Others (${users.others.length})`} />
          {openSections.others ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openSections.others} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {renderUserList(users.others)}
          </List>
        </Collapse>
      </List>
    </Box>
  );
};

export default SidebarForChat;