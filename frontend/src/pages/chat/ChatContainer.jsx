import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Paper, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { clearSelectedContact } from "../../features/chatSlice";
import API from "../../api/api";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const selectedContact = useSelector((state) => state.chat.selectedContact);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages();
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token || !selectedContact) return;

      const response = await API.get(`/message/get/${selectedContact._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(response.data || []);
    } catch (err) {
      console.log("Error fetching messages:", err);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "" || !selectedContact) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await API.post(
        "/message/send",
        { receiverId: selectedContact._id, text: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessages([...messages, response.data.newMessage]);
      setNewMessage("");
    } catch (err) {
      console.log("Error sending message:", err);
    }
  };

  if (!selectedContact) {
    return (
      <Box
        flexGrow={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6" color="gray">
          Select a contact to start chatting
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      flexGrow={1}
      p={2}
      bgcolor={colors.primary[900]}
      borderRadius="10px"
    >
      {/* Chat Header */}
      <Paper
        elevation={3}
        sx={{
          p: 2,
          mb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderRadius: "10px",
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
        <IconButton
          onClick={() => dispatch(clearSelectedContact())}
          color="error"
        >
          <CloseIcon />
        </IconButton>
      </Paper>

      {/* Chat Messages */}
      <Box
        flexGrow={1}
        overflow="auto"
        p={2}
        bgcolor={colors.bgc[100]}
        borderRadius="10px"
        sx={{ maxHeight: "70vh", display: "flex", flexDirection: "column" }}
      >
        {messages.map((msg) => (
          <Box
            key={msg._id}
            sx={{
              mb: 1.5,
              p: 1.5,
              borderRadius: "8px",
              bgcolor: msg.sender === selectedContact._id ? "#e0e0e0" : "#007499",
              color: msg.sender === selectedContact._id ? "black" : "white",
              alignSelf: msg.sender === selectedContact._id ? "flex-start" : "flex-end",
              maxWidth: "60%",
            }}
          >
            <Typography variant="body1">{msg.text}</Typography>
            <Typography variant="caption" display="block" textAlign="right">
              {new Date(msg.createdAt).toLocaleTimeString()}
            </Typography>
          </Box>
        ))}
        <div ref={messagesEndRef} />
      </Box>

      {/* Message Input Box */}
      <Box display="flex" mt={2} alignItems="center">
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <IconButton onClick={handleSendMessage} color="primary" sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatContainer;
