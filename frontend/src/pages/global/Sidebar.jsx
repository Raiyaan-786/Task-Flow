import { useEffect, useState } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import "react-pro-sidebar/dist/css/styles.css";
import { tokens } from "../../theme";
import { AssessmentOutlined, BadgeOutlined, DashboardOutlined, FolderOpenOutlined, GroupOutlined, LinkOutlined, ReceiptLongOutlined, SupervisorAccountOutlined, WorkOutlineOutlined } from "@mui/icons-material";
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

  console.log(user)
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
        "& .pro-inner-item:hover": {
          color: "#cb3cff !important",
        },
        "& .pro-menu-item.active": {
          color: "#cb3cff !important",
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
              icon={<DashboardOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 15px" }}
            >
              Manage
            </Typography>
            <Item
              title="Work"
              to="/workmanager"
              icon={<WorkOutlineOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Customer"
              to="/customermanager"
              icon={<GroupOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Consultant"
              to="/consultantmanager"
              icon={<SupervisorAccountOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />
              <Item
              title="HR Section"
              to="/employee"
              icon={<BadgeOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />
               <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 15px" }}
            >
            Finance
            </Typography>
            <Item
              title="Invoices"
              to="/invoices"
              icon={< ReceiptLongOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Report"
              to="/report"
              icon={<AssessmentOutlined/>}
              selected={selected}
              setSelected={setSelected}
            />
            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 15px" }}
            >
            Files
            </Typography>
            <Item
              title="File Manager"
              to="/filemanager"
              icon={<FolderOpenOutlined/>}
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