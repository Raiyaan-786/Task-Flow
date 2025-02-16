import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Paper, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { clearSelectedContact, fetchMessages, sendMessage } from "../../features/chatSlice";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { io } from "socket.io-client";


const ChatContainer = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const selectedContact = useSelector((state) => state.chat.selectedContact);
  const messages = useSelector((state) => state.chat.messages);
  const currentUser = useSelector((state) => state.auth.user);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);

  const socket = io("http://localhost:4000", {
  query: { userId: currentUser._id },
  withCredentials: true, // Allow cross-origin requests with authentication
  transports: ["websocket", "polling"],
});

  useEffect(() => {
    if (currentUser) {
      socket.emit("joinChat", { userId: currentUser._id });
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedContact) {
      dispatch(fetchMessages(selectedContact._id));
      socket.emit("joinChat", { userId: currentUser._id, contactId: selectedContact._id });
    }
  }, [selectedContact, dispatch]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Client connected with socket id:", socket.id);
    });
    socket.on("disconnect", () => {
      console.log("Client disconnected");
    });
  
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);
  
  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!selectedContact) return;
    socket.emit("joinChat", { userId: currentUser._id, contactId: selectedContact._id });
  
    socket.on("newMessage", (newMessage) => {
      if (newMessage.sender === selectedContact._id || newMessage.receiver === selectedContact._id) {
        dispatch(fetchMessages(selectedContact._id));
      }
    });
  
    return () => {
      socket.off("newMessage");
    };
  }, [dispatch, selectedContact, currentUser]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContact) return;

    dispatch(
      sendMessage({
        senderId: currentUser._id,
        receiverId: selectedContact._id,
        text: newMessage,
        socket,
      })
    );
    setNewMessage("");

  };

  if (!selectedContact) {
    return (
      <Box flexGrow={1} display="flex" alignItems="center" justifyContent="center">
        <Typography variant="h6" color="gray">
          Select a contact to start chatting
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" flexGrow={1} p={2} bgcolor={colors.primary[900]} borderRadius="10px">
      {/* 🔹 Fixed Chat Header */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "10px",
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography variant="h6">
            {selectedContact.name} ({selectedContact.role})
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedContact.email}
          </Typography>
        </Box>
        <IconButton onClick={() => dispatch(clearSelectedContact())} color="error">
          <CloseIcon />
        </IconButton>
      </Paper>

      {/* 🔹 Scrollable Chat Messages */}
      <Box
        flexGrow={1}
        overflow="auto"
        p={2}
        bgcolor={colors.bgc[100]}
        borderRadius="10px"
        sx={{ maxHeight: "53vh", display: "flex", flexDirection: "column" }}
      >
        {messages.map((msg, index) => {
          const isMyMessage = msg.sender === currentUser._id;
          return (
            <Box
              key={index}
              sx={{
                mb: 1.5,
                p: 1.5,
                borderRadius: "8px",
                bgcolor: isMyMessage ? "#007499" : "#e0e0e0",
                color: isMyMessage ? "white" : "black",
                alignSelf: isMyMessage ? "flex-end" : "flex-start",
                maxWidth: "60%",
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              <Typography variant="caption" display="block" textAlign="right">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </Typography>
            </Box>
          );
        })}
        <div ref={messageEndRef} />
      </Box>

      {/* 🔹 Fixed Message Input */}
      <Box
        display="flex"
        mt={2}
        alignItems="center"
        flexShrink={0}
        bgcolor="white"
        p={1}
        borderRadius="10px"
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <IconButton onClick={handleSendMessage} color="primary" sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatContainer;
