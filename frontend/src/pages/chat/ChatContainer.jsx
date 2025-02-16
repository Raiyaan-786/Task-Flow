import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Paper, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { clearSelectedContact } from "../../features/chatSlice";
import API from "../../api/api";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { io } from "socket.io-client";

// Initialize socket connection
const socket = io("http://localhost:4000", { withCredentials: true });

const ChatContainer = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const selectedContact = useSelector((state) => state.chat.selectedContact);
  const currentUser = useSelector((state) => state.auth.user);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedContact) {
      fetchMessages();
      socket.emit("joinChat", { userId: currentUser._id, contactId: selectedContact._id });
    }
  }, [selectedContact]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

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

      const messageData = {
        sender: currentUser._id,
        receiverId: selectedContact._id,
        text: newMessage,
      };

      socket.emit("sendMessage", messageData);

      const response = await API.post("/message/send", messageData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessages([...messages, response.data.newMessage]);
      setNewMessage("");
    } catch (err) {
      console.log("Error sending message:", err);
    }
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
          flexShrink: 0 , // Keeps header fixed
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
        flexGrow={1} //  Allows this section to take remaining space
        overflow="auto" //  Enables scrolling only here
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
        <div ref={messagesEndRef} />
      </Box>

      {/* 🔹 Fixed Message Input */}
      <Box
        display="flex"
        mt={2}
        alignItems="center"
        flexShrink={0} //  Keeps input box fixed
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
        //   onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <IconButton onClick={handleSendMessage} color="primary" sx={{ ml: 1 }}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatContainer;
