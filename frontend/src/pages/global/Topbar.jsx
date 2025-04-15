import { useTheme } from "@emotion/react";
import React, { useContext, useEffect, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import {
  Avatar,
  Badge,
  Box,
  IconButton,
  InputBase,
  List,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import {
  DarkModeOutlined,
  LightModeOutlined,
  MenuOutlined,
  NotificationsOutlined,
  PersonOutline,
  Search,
  SettingsOutlined,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice";
import { useNavigate } from "react-router-dom";
import API from "../../api/api";

const Topbar = ({ isCollapsed, setIsCollapsed }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  const dispatch = useDispatch();
  const navigate = useNavigate(); // React Router navigation hook

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { socket } = useSelector((store) => store.socketio);

  // Fetch initial notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await API.get("/notifications");
        setNotifications(response.data);
        setUnreadCount(response.data.filter((n) => !n.read).length);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  // Socket.io listeners
  useEffect(() => {
    if (!socket) return;

    socket.on("newNotification", (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      setUnreadCount((prev) => prev + 1);

      // Show browser notification if window not focused
      if (document.visibilityState !== "visible") {
        new Notification("New message", {
          body: notification.content,
          icon: notification.sender?.avatar,
        });
      }
    });

    socket.on("notificationRead", (notificationId) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    });

    return () => {
      socket.off("newNotification");
      socket.off("notificationRead");
    };
  }, [socket]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await API.patch(`/notifications/${notificationId}/read`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, read: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  // State to control profile menu
  const [anchorElProfile, setAnchorElProfile] = useState(null);
  const isProfileMenuOpen = Boolean(anchorElProfile);

  // State to control notification menu
  const [anchorElNotification, setAnchorElNotification] = useState(null);
  const isNotificationMenuOpen = Boolean(anchorElNotification);

  // Handlers for profile menu
  const handleProfileMenuOpen = (event) => {
    setAnchorElProfile(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorElProfile(null);
  };

  const handleProfileClick = () => {
    navigate("/userprofile"); // Navigate to the profile page
    handleProfileMenuClose();
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login"); // Optional: Navigate to the login page after logout
  };

  // Handlers for notification menu
  const handleNotificationMenuOpen = (event) => {
    setAnchorElNotification(event.currentTarget);
  };

  const handleNotificationMenuClose = () => {
    setAnchorElNotification(null);
  };

  // Notification menu content
  const notificationContent = (
    <List sx={{ width: 350, maxHeight: 400, overflow: "auto" }}>
      {notifications.length === 0 ? (
        <Typography variant="body2" sx={{ p: 2, textAlign: "center" }}>
          No notifications
        </Typography>
      ) : (
        notifications.map((notification) => (
          <MenuItem
            key={notification._id}
            onClick={() => handleMarkAsRead(notification._id)}
            sx={{
              borderBottom: "1px solid rgba(0,0,0,0.1)",
              bgcolor: notification.read ? "inherit" : "action.hover",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
              <Avatar
                src={notification.sender?.avatar}
                sx={{ width: 40, height: 40, mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle2">
                  {notification.sender?.name || "System"}
                </Typography>
                <Typography variant="body2">{notification.content}</Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </Box>
          </MenuItem>
        ))
      )}
    </List>
  );

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      p={2}
      bgcolor={colors.primary[900]}
    >
      {/* Search bar */}
      <Box display="flex" gap={2} alignItems="center">
        <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
          <MenuOutlined />
        </IconButton>
        <Box
          display="flex"
          bgcolor={colors.bgc[100]}
          borderRadius="5px"
          height="30px"
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <Search />
          </IconButton>
        </Box>
      </Box>

      {/* Icon buttons */}
      <Box display="flex">
        <IconButton onClick={colorMode.toggleColorMode}>
          {theme.palette.mode === "dark" ? (
            <DarkModeOutlined />
          ) : (
            <LightModeOutlined />
          )}
        </IconButton>

        {/* Updated Notification Icon */}
        <IconButton onClick={handleNotificationMenuOpen}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsOutlined />
          </Badge>
        </IconButton>
        <Menu
          anchorEl={anchorElNotification}
          open={isNotificationMenuOpen}
          onClose={handleNotificationMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          {notificationContent}
        </Menu>

        {/* Notifications Icon with Dropdown 
        <IconButton onClick={handleNotificationMenuOpen}>
          <NotificationsOutlined />
        </IconButton>
        <Menu
          anchorEl={anchorElNotification}
          open={isNotificationMenuOpen}
          onClose={handleNotificationMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleNotificationMenuClose}>
            <Typography variant="body2">New comment on your post</Typography>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Typography variant="body2">Your profile was viewed</Typography>
          </MenuItem>
          <MenuItem onClick={handleNotificationMenuClose}>
            <Typography variant="body2">Update available for your app</Typography>
          </MenuItem>
        </Menu> */}

        {/* Settings Icon */}
        <IconButton onClick={() => navigate("/settings")}>
          <SettingsOutlined />
        </IconButton>

        {/* Profile Icon with Menu */}
        <IconButton onClick={handleProfileMenuOpen}>
          <PersonOutline />
        </IconButton>
        <Menu
          anchorEl={anchorElProfile}
          open={isProfileMenuOpen}
          onClose={handleProfileMenuClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default Topbar;
