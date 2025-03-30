import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import {  Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import { AssessmentOutlined,  ChatBubble,Badge, ChatBubbleOutline, DashboardOutlined, FolderOpenOutlined, Group, GroupOutlined, LinkOutlined, Receipt, ReceiptLongOutlined, ReceiptOutlined, SupervisorAccount, SupervisorAccountOutlined, WhatsApp, Work, WorkOutlineOutlined, Dashboard, ReceiptLong, Assessment, FolderOpen, Folder } from "@mui/icons-material";
import { useSelector } from "react-redux";

const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = ({isCollapsed}) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      console.log("User is not logged in!");
    }
  }, [user]);

  // console.log(user)
  return (
    <Box
      height={'100vh'}
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[900]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-icon": {
          color: `${colors.teal[300]} !important`,
          // color: `${colors.pink[600]} !important`,
        },
        // "& .pro-icon": {
        //   color: "#cb3cff !important",
        // },
        "& .pro-inner-item:hover": {
          // color: "#cb3cff !important",
          color: `${colors.teal[300]} !important`,
        },
        "& .pro-menu-item.active": {
          // color: "#cb3cff !important",
          color: `${colors.teal[300]} !important`,
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}>
        <Menu iconShape="square">
          {/* LOGO AND MENU ICON */}
          <MenuItem
            icon={isCollapsed ? <img height={'28px'} width={'32px'} src="logoicon.svg"/> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent='center'
                alignItems="center"
                ml="15px"
              >
                <img height={'28px'} width={'32px'} src="/logoicon.svg" alt="brandlogo" />
                <Typography ml={1} variant="h3" color={colors.grey[100]} fontWeight={'bold'}>
                  TASK-FLOW
                </Typography>
              </Box>
            )}
          </MenuItem>

          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src="/profileimg1.jpg"
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                  {user.name}
                </Typography>
                <Typography variant="h6" color={colors.teal[500]}>
                  {user.role}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"} >
            <Item
              title="Dashboard"
              to="/"
              icon={<Dashboard/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="body2"
              fontWeight={500}
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Manage
            </Typography>
            <Item
              title="Work"
              to="/workmanager"
              icon={<Work/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Customer"
              to="/customermanager"
              icon={<Group/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Consultant"
              to="/consultantmanager"
              icon={<SupervisorAccount/>}
              selected={selected}
              setSelected={setSelected}
            />
              <Item
              title="HR Section"
              to="/employee"
              icon={<Badge/>}
              selected={selected}
              setSelected={setSelected}
            />
              <Item
              title="Chat "
              to="/chat"
              icon={<ChatBubble/>}
              selected={selected}
              setSelected={setSelected}
            />
               <Typography
              variant="body2"
              fontWeight={500}
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
            Finance
            </Typography>
            <Item
              title="Payroll"
              to="/payroll"
              icon={<Receipt/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices"
              to="/invoices"
              icon={< ReceiptLong/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Report"
              to="/report"
              icon={<Assessment/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="body2"
              fontWeight={500}
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
            Files
            </Typography>
            <Item
              title="File Manager"
              to="/filemanager"
              icon={<Folder/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Useful Links"
              to="/usefullinks"
              icon={<LinkOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;