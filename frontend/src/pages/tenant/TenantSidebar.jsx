import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { tenantLogout } from "../../features/tenantAuthSlice";
import { Avatar, Box, Divider, IconButton, Tooltip, Typography, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { tokens } from "../../theme";
import {
  HomeOutlined,
  PersonOutline,
  ListAltOutlined,
  PaymentOutlined,
  SettingsOutlined,
  LogoutOutlined,
  CallMadeOutlined,
} from "@mui/icons-material";

// Define the shaking animation
const shakeAnimation = `
  @keyframes shake {
    0% { transform: rotate(0deg) translateX(0); }
    20% { transform: rotate(10deg) translateX(2px); }
    40% { transform: rotate(-10deg) translateX(-2px); }
    60% { transform: rotate(6deg) translateX(1px); }
    80% { transform: rotate(-6deg) translateX(-1px); }
    100% { transform: rotate(0deg) translateX(0); }
  }
`;

const TenantSidebar = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Profile");
  const { tenant } = useSelector((state) => state.tenantAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!tenant) {
      console.log("Tenant is not logged in!");
    }
  }, [tenant]);

  const handleLogout = () => {
    dispatch(tenantLogout());
    navigate("/tenantlogin");
  };

  const menuItems = [
    // { title: "Home", to: "/tenant/home", icon: <HomeOutlined /> },
    { title: "Profile", to: "/tenant/profile", icon: <PersonOutline /> },
    { title: "Plan", to: "/tenant/plan", icon: <ListAltOutlined /> },
    { title: "Transactions", to: "/tenant/transactions", icon: <PaymentOutlined /> },
    { title: "Settings", to: "/tenant/settings", icon: <SettingsOutlined /> },
    { title: "TaskFlow", to: "", icon: <CallMadeOutlined/>, onClick: handleLogout },
    // { title: "Logout", to: "", icon: <LogoutOutlined />, onClick: handleLogout },
  ];

  return (
    <motion.div
      animate={{ width: isCollapsed ? 80 : 320 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      sx={{
        height: "100vh",
        position: "relative",
        transition: "width 0.4s ease-in-out",
        backgroundColor: `${colors.foreground[100]} !important`,
        overflow: "hidden",
       
      }}
    >
      <style>{shakeAnimation}</style>
      <Box
        sx={{
          // padding: isCollapsed ? "10px" : "10px 20px",
          paddingTop: "10px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflowY: "auto",
          bgcolor: colors.foreground[100],
           borderRight: ".5px solid #e8e8e8",
          
           
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            margin: "20px 5px 25px 5px",
            display: "flex",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "flex-start",
            transition: "all 0.3s ease-in-out",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              transition: "all 0.3s ease-in-out",
              overflow: "hidden",
              ml: isCollapsed ? "0px" : "15px",
            }}
          >
             <img
              height="28px"
              width="32px"
              src="/logoicon.svg"
              alt="brandlogo"
              style={{ transition: "transform 0.3s ease-in-out" }}
            />
            {!isCollapsed && (
              <motion.div
                animate={{ opacity: isCollapsed ? 0 : 1 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Typography
                  ml={1}
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    transition: "opacity 0.3s ease-in-out",
                    opacity: isCollapsed ? 0 : 1,
                  }}
                >
                  TENANT PORTAL
                </Typography>
              </motion.div>
            )}
          </Box>
        </Box>

        {/* Tenant Profile */}
        {isCollapsed && (
          <motion.div
            animate={{ opacity: isCollapsed ? 0 : 1, height: isCollapsed ? 0 : "auto" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            sx={{ mb: "25px", overflow: "hidden" }}
          >
            <Box display="flex" justifyContent="center" alignItems="center">
              
              <Avatar src={tenant?.image } alt="Remy Sharp" sx={{ width: "100px", height: "100px" }} />
            </Box>
            <Box textAlign="center">
              <motion.div
                animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -10 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Typography
                  variant="h4"
                  color={colors.grey[100]}
                  fontWeight={600}
                  sx={{
                    m: "10px 0 0 0",
                    opacity: isCollapsed ? 0 : 1,
                    transform: isCollapsed ? "translateX(-10px)" : "translateX(0)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {tenant?.name || "Tenant Name"}
                </Typography>
              </motion.div>
              <motion.div
                animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -10 : 0 }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                {/* <Typography
                  variant="h6"
                  color={colors.blueHighlight[900]}
                  sx={{
                    opacity: isCollapsed ? 0 : 1,
                    transform: isCollapsed ? "translateX(-10px)" : "translateX(0)",
                    transition: "all 0.3s ease",
                  }}
                >
                  Tenant
                </Typography> */}
              </motion.div>
            </Box>
          </motion.div>
        )}

        {/* Menu Items with Scroll */}
        <Box sx={{ flexGrow: 1,mt:1, padding: isCollapsed ? "10px" : "0px 20px" }}>
          {menuItems.slice(0, 3).map((item) => (
            <Link
              to={item.to}
              key={item.title}
              style={{ textDecoration: "none", width: "100%" }}
              onClick={() => setSelected(item.title)}
            >
              <Box
                sx={{
                  width: isCollapsed ? "60px" : "100%",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  padding: "11px 16px",
                  borderRadius: "10px",
                  marginBottom: "8px",
                  backgroundColor:
                    selected === item.title
                      ? `${colors.blueHighlight[900]} !important`
                      : "transparent",
                  color:
                    selected === item.title
                      ? colors.foreground[100]
                      : colors.grey[100],
                  "&:hover": {
                    backgroundColor:
                      selected === item.title
                        ? `${colors.blueHighlight[900]} !important`
                        : `${colors.sidebarHover[100]} !important`,
                    color:
                      selected === item.title
                        ? colors.foreground[100]
                        : colors.grey[100],
                  },
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  "&:hover svg": {
                    animation: "shake 0.5s",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    "& svg": {
                      fontSize: "20px",
                      marginRight: isCollapsed ? 0 : "8px",
                      transition: "transform 0.2s ease-in-out",
                    },
                    "&:hover svg": {
                      animation: "shake 0.5s",
                    },
                  }}
                >
                  {item.icon}
                </Box>
                {!isCollapsed && (
                  <motion.div
                    animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Typography
                      ml={1}
                      variant="body1"
                      sx={{
                        color: "inherit",
                        opacity: isCollapsed ? 0 : 1,
                        transform: isCollapsed ? "translateX(-20px)" : "translateX(0)",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </motion.div>
                )}
              </Box>
            </Link>
          ))}
          <Divider sx={{ marginTop: 1, marginBottom: 1 }} />
          {menuItems.slice(3, 5).map((item) => (
            <Link
              to={item.to}
              key={item.title}
              style={{ textDecoration: "none", width: "100%" }}
              onClick={() => setSelected(item.title)}
            >
              <Box
                sx={{
                  width: isCollapsed ? "60px" : "100%",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  padding: "11px 16px",
                  borderRadius: "10px",
                  marginBottom: "8px",
                  backgroundColor:
                    selected === item.title
                      ? `${colors.blueHighlight[900]} !important`
                      : "transparent",
                  color:
                    selected === item.title
                      ? colors.foreground[100]
                      : colors.grey[100],
                  "&:hover": {
                    backgroundColor:
                      selected === item.title
                        ? `${colors.blueHighlight[900]} !important`
                        : `${colors.sidebarHover[100]} !important`,
                    color:
                      selected === item.title
                        ? colors.foreground[100]
                        : colors.grey[100],
                  },
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                  "&:hover svg": {
                    animation: "shake 0.5s",
                  },
                }}
              >
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    "& svg": {
                      fontSize: "20px",
                      marginRight: isCollapsed ? 0 : "8px",
                      transition: "transform 0.2s ease-in-out",
                    },
                    "&:hover svg": {
                      animation: "shake 0.5s",
                    },
                  }}
                >
                  {item.icon}
                </Box>
                {!isCollapsed && (
                  <motion.div
                    animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Typography
                      ml={1}
                      variant="body1"
                      sx={{
                        color: "inherit",
                        opacity: isCollapsed ? 0 : 1,
                        transform: isCollapsed ? "translateX(-20px)" : "translateX(0)",
                        transition: "all 0.3s ease",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </Typography>
                  </motion.div>
                )}
              </Box>
            </Link>
          ))}
          {/* <Divider sx={{ marginTop: 1, marginBottom: 1 }} /> */}
          {menuItems.slice(5).map((item) => (
            <Box
              key={item.title}
              sx={{
                width: isCollapsed ? "60px" : "100%",
                justifyContent: isCollapsed ? "center" : "flex-start",
                padding: "11px 16px",
                borderRadius: "10px",
                marginBottom: "8px",
                backgroundColor:
                  selected === item.title
                    ? `${colors.blueHighlight[900]} !important`
                    : "transparent",
                color:
                  selected === item.title
                    ? colors.foreground[100]
                    : colors.grey[100],
                "&:hover": {
                  backgroundColor:
                    selected === item.title
                      ? `${colors.blueHighlight[900]} !important`
                      : `${colors.sidebarHover[100]} !important`,
                  color:
                    selected === item.title
                      ? colors.foreground[100]
                      : colors.grey[100],
                },
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
                "&:hover svg": {
                  animation: "shake 0.5s",
                },
              }}
              onClick={() => {
                setSelected(item.title);
                if (item.onClick) {
                  item.onClick();
                }
              }}
            >
              <Box
                sx={{
                  display: "inline-flex",
                  alignItems: "center",
                  "& svg": {
                    fontSize: "20px",
                    marginRight: isCollapsed ? 0 : "8px",
                    transition: "transform 0.2s ease-in-out",
                  },
                  "&:hover svg": {
                    animation: "shake 0.5s",
                  },
                }}
              >
                {item.icon}
              </Box>
              {!isCollapsed && (
                <motion.div
                  animate={{ opacity: isCollapsed ? 0 : 1, x: isCollapsed ? -20 : 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                >
                  <Typography
                    ml={1}
                    variant="body1"
                    sx={{
                      color: "inherit",
                      opacity: isCollapsed ? 0 : 1,
                      transform: isCollapsed ? "translateX(-20px)" : "translateX(0)",
                      transition: "all 0.3s ease",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.title}
                  </Typography>
                </motion.div>
              )}
            </Box>
          ))}
        </Box>
        <Box  borderTop={'.5px solid #e8e8e8'} sx={{padding:3,height:'100px',width:'100%',display:'flex',alignItems:'center'}}>
          <Avatar  src={tenant?.image } alt="Remy Sharp" sx={{ width: "50px", height: "50px" }} />
          <Box padding={2}>
            <Typography variant="body1" fontWeight={700} color="initial">{tenant?.name || "Tenant Name"}</Typography>
            <Typography variant="body2" color="text.secondary">{tenant.email}</Typography>
          </Box>
          <Tooltip title="Logout">
          <IconButton aria-label="Logout" onClick={handleLogout}>
            <LogoutOutlined/>
          </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </motion.div>
  );
};

export default TenantSidebar;