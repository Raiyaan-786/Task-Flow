import React from "react";
import { useEffect, useState } from "react";
import { Avatar, Box, Divider, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";
import { color, motion } from "framer-motion";
import { tokens } from "../../theme";
const user = JSON.parse(localStorage.getItem("user"));
import {
  AssessmentOutlined,
  ChatBubbleOutlineOutlined,
  FolderOutlined,
  GroupsOutlined,
  HomeOutlined,
  LinkOutlined,
  ReceiptOutlined,
  SupervisorAccountOutlined,
  WorkOutline,
  BadgeOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";
import { useSelector } from "react-redux";

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

const Sidebar = ({ isCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      console.log("User is not logged in!");
    }
  }, [user]);

  const menuItems = [
    { title: "Dashboard", to: "/", icon: <HomeOutlined /> },
    { title: "Work", to: "/workmanager", icon: <WorkOutline /> },
    { title: "Customer", to: "/customermanager", icon: <GroupsOutlined /> },
    {
      title: "Consultant",
      to: "/consultantmanager",
      icon: <SupervisorAccountOutlined />,
    },
    { title: "HR Section", to: "/employee", icon: <BadgeOutlined /> },
    { title: "Chat", to: "/chat", icon: <ChatBubbleOutlineOutlined /> },
    { title: "Payroll", to: "/payroll", icon: <ReceiptOutlined /> },
    { title: "Invoices", to: "/invoices", icon: <ReceiptLongOutlined /> },
    { title: "Report", to: "/report", icon: <AssessmentOutlined /> },
    { title: "File Manager", to: "/filemanager", icon: <FolderOutlined /> },
    { title: "Useful Links", to: "/usefullinks", icon: <LinkOutlined /> },
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
          padding: isCollapsed ? "10px" : "10px 20px",
          display: "flex",
          flexDirection: "column",
          height: "100%",
          overflowX: "hidden",
          overflowY: "auto",
          bgcolor: colors.foreground[100],
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            margin: "10px 0 25px 0",
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
         
            <Avatar
                src={user.companyLogo || "logoicon.svg"}
                sx={{ width: "32px", height: "32px" ,borderRadius:0}}
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
                  {user.companyName
                    ? user.companyName.length > 10
                      ? `${user.companyName.slice(0, 10)}...`
                      : user.companyName
                    : "TASK-FLOW"}
                </Typography>
              </motion.div>
            )}
          </Box>
        </Box>

        {/* User Profile */}
        {!isCollapsed && (
          <motion.div
            animate={{
              opacity: isCollapsed ? 0 : 1,
              height: isCollapsed ? 0 : "auto",
            }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            sx={{ mb: "25px", overflow: "hidden" }}
          >
            {/* <Box display="flex" justifyContent="center" alignItems="center" >
              <img
                // alt="defaultavatar.svg"
                width="100px"
                height="100px"
                src={user.image || "defaultavatar.jpg"}
                style={{ cursor: "pointer", borderRadius: "50%" }}
              />
            </Box> */}
            <Box display="flex" justifyContent="center" alignItems="center">
              <Avatar
                src={user?.image}
                alt="Remy Sharp"
                sx={{ width: "100px", height: "100px" }}
              />
            </Box>
            <Box textAlign="center">
              <motion.div
                animate={{
                  opacity: isCollapsed ? 0 : 1,
                  x: isCollapsed ? -10 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{
                    m: "10px 0 0 0",
                    opacity: isCollapsed ? 0 : 1,
                    transform: isCollapsed
                      ? "translateX(-10px)"
                      : "translateX(0)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {user.name}
                </Typography>
              </motion.div>
              <motion.div
                animate={{
                  opacity: isCollapsed ? 0 : 1,
                  x: isCollapsed ? -10 : 0,
                }}
                transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              >
                <Typography
                  variant="h6"
                  color={colors.blueHighlight[900]}
                  sx={{
                    opacity: isCollapsed ? 0 : 1,
                    transform: isCollapsed
                      ? "translateX(-10px)"
                      : "translateX(0)",
                    transition: "all 0.3s ease",
                  }}
                >
                  {user.role}
                </Typography>
              </motion.div>
            </Box>
          </motion.div>
        )}

        {/* Menu Items with Scroll */}
        <Box sx={{ flexGrow: 1, mt: 2 }}>
          {menuItems.slice(0, 6).map((item) => (
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
                    animate={{
                      opacity: isCollapsed ? 0 : 1,
                      x: isCollapsed ? -20 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Typography
                      ml={1}
                      variant="body1"
                      sx={{
                        color: "inherit",
                        opacity: isCollapsed ? 0 : 1,
                        transform: isCollapsed
                          ? "translateX(-20px)"
                          : "translateX(0)",
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
          {menuItems.slice(6, 9).map((item) => (
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
                    animate={{
                      opacity: isCollapsed ? 0 : 1,
                      x: isCollapsed ? -20 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Typography
                      ml={1}
                      variant="body1"
                      sx={{
                        color: "inherit",
                        opacity: isCollapsed ? 0 : 1,
                        transform: isCollapsed
                          ? "translateX(-20px)"
                          : "translateX(0)",
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
          {menuItems.slice(9).map((item) => (
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
                    animate={{
                      opacity: isCollapsed ? 0 : 1,
                      x: isCollapsed ? -20 : 0,
                    }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <Typography
                      ml={1}
                      variant="body1"
                      sx={{
                        color: "inherit",
                        opacity: isCollapsed ? 0 : 1,
                        transform: isCollapsed
                          ? "translateX(-20px)"
                          : "translateX(0)",
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
        </Box>
      </Box>
    </motion.div>
  );
};

export default Sidebar;
