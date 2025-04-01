import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Box, Typography, Paper, TextField, IconButton } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CloseIcon from "@mui/icons-material/Close";
import { setMessages } from "../../features/chatSlice";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import API from "../../api/api";
import { setSelectedUser } from "../../features/authSlice";

const ChatContainer = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const { user, selectedUser } = useSelector((store) => store.auth);
  const { onlineUsers, messages } = useSelector((store) => store.chat);
  const { socket } = useSelector((store) => store.socketio);
  const [textMessage, setTextMessage] = useState("");
  const messageEndRef = useRef(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load messages when selected user changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedUser?._id) return;
      
      try {
        const response = await API.get(`/message/get/${selectedUser._id}`, {
          withCredentials: true
        });
        dispatch(setMessages(response.data));
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);

  // Socket.IO setup
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      // Verify the message is relevant to current chat
      if ([newMessage.sender, newMessage.receiver].includes(selectedUser?._id)) {
        dispatch(setMessages([...messages, newMessage]));
      }
    };

    socket.on("newMessage", handleNewMessage);
    
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, messages, dispatch]);

  const sendMessageHandler = async () => {
    if (!textMessage.trim() || !selectedUser?._id) return;
    
    // Create temporary message object
    const tempMessage = {
      _id: Date.now().toString(), // Temporary ID
      sender: user._id,
      receiver: selectedUser._id,
      text: textMessage,
      createdAt: new Date().toISOString(),
      isOptimistic: true // Flag for optimistic update
    };
  
    // Optimistically update UI immediately
    dispatch(setMessages([...messages, tempMessage]));
    setTextMessage("");
  
    try {
      const response = await API.post(
        `/message/send/${selectedUser._id}`,
        { text: textMessage },
        { withCredentials: true }
      );
  
      if (response.data.success) {
        // Replace optimistic message with real one from server
        dispatch(setMessages([
          ...messages.filter(m => m._id !== tempMessage._id),
          response.data.newMessage
        ]));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Roll back optimistic update on error
      dispatch(setMessages(messages.filter(m => m._id !== tempMessage._id)));
    }
  };
  if (!selectedUser) {
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
      {/* Chat Header */}
      <Paper elevation={3} sx={{ 
        p: 2, 
        mb: 2, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        borderRadius: "10px" 
      }}>
        <Box>
          <Typography variant="h6">
            {selectedUser.name} ({selectedUser.role})
            {onlineUsers.includes(selectedUser._id) && (
              <span style={{ color: 'green', marginLeft: '8px' }}>• Online</span>
            )}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {selectedUser.email}
          </Typography>
        </Box>
        <IconButton onClick={() => dispatch(setSelectedUser(null))} color="error">
          <CloseIcon />
        </IconButton>
      </Paper>

      {/* Messages Container */}
      <Box 
        flexGrow={1} 
        overflow="auto" 
        p={2} 
        bgcolor={colors.bgc[100]} 
        borderRadius="10px" 
        sx={{ 
          maxHeight: "53vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {messages.map((msg, index) => {
          const isMyMessage = msg.sender === user._id;
          const messageDate = msg.createdAt ? new Date(msg.createdAt) : new Date();
          
          return (
            <Box
              key={index}
              sx={{
                mb: 1.5,
                p: 1.5,
                borderRadius: "8px",
                bgcolor: isMyMessage ? colors.teal[300] : colors.grey[800],
                color: isMyMessage ? "white" : "black",
                alignSelf: isMyMessage ? "flex-end" : "flex-start",
                marginLeft: isMyMessage ? "auto" : 0,
                marginRight: isMyMessage ? 0 : "auto",
                maxWidth: "60%",
                wordBreak: "break-word"
              }}
            >
              <Typography variant="body1">{msg.text}</Typography>
              <Typography 
                variant="caption" 
                display="block"
                sx={{
                  textAlign: isMyMessage ? "right" : "left",
                  color: isMyMessage ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)"
                }}
              >
                {messageDate.toString() !== 'Invalid Date' 
                  ? messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : 'Just now'}
              </Typography>
            </Box>
          );
        })}
        <div ref={messageEndRef} />
      </Box>

      {/* Message Input */}
      <Box 
        display="flex" 
        mt={2} 
        alignItems="center" 
        bgcolor="white" 
        p={1} 
        borderRadius="10px"
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Type a message..."
          value={textMessage}
          onChange={(e) => setTextMessage(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessageHandler()}
        />
        <IconButton 
          onClick={sendMessageHandler} 
          color="primary" 
          sx={{ ml: 1 }}
          disabled={!textMessage.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default ChatContainer;