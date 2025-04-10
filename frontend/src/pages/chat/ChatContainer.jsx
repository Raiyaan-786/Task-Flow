import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
  Box, 
  Typography, 
  Paper, 
  TextField, 
  IconButton,
  Tooltip
} from "@mui/material";
import {
  Send as SendIcon,
  Close as CloseIcon,
  AttachFile as AttachFileIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Image as ImageIcon,
  Cancel as CancelIcon
} from "@mui/icons-material";
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
  const { onlineUsers, messages = [] } = useSelector((store) => store.chat);
  const { socket } = useSelector((store) => store.socketio);
  const [textMessage, setTextMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messageEndRef = useRef(null);
  const fileInputRef = useRef(null);

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
        dispatch(setMessages(response.data || []));
      } catch (error) {
        console.error("Error fetching messages:", error);
        dispatch(setMessages([]));
      }
    };

    fetchMessages();
  }, [selectedUser, dispatch]);

  // Socket.IO setup
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      if (!newMessage?.sender) return;
      
      if ([newMessage.sender, newMessage.receiver].includes(selectedUser?._id)) {
        dispatch(setMessages([...messages, newMessage]));
      }
    };

    socket.on("newMessage", handleNewMessage);
    
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, messages, dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large (max 10MB)');
      return;
    }
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const sendMessageHandler = async () => {
    if ((!textMessage.trim() && !selectedFile) || isSending) return;
    
    setIsSending(true);
    const formData = new FormData();
    if (textMessage) formData.append('text', textMessage);
    if (selectedFile) formData.append('file', selectedFile);

    // Create temporary message object
    const tempId = Date.now().toString();
    const tempMessage = {
      _id: tempId,
      sender: user._id,
      receiver: selectedUser._id,
      text: textMessage,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      file: selectedFile ? {
        filename: selectedFile.name,
        isUploading: true
      } : null
    };

    // Optimistic update
    dispatch(setMessages([...messages, tempMessage]));
    setTextMessage('');
    setSelectedFile(null);

    try {
      const response = await API.post(
        `/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Replace optimistic message with server response
      if (response.data?.newMessage) {
        dispatch(setMessages([
          ...messages.filter(m => m._id !== tempId),
          response.data.newMessage
        ]));
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Rollback optimistic update
      dispatch(setMessages(messages.filter(m => m._id !== tempId)));
    } finally {
      setIsSending(false);
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    const fileType = selectedFile.type?.split('/')[0] || 'file';
    const fileName = selectedFile.name;
    const fileSize = (selectedFile.size / (1024 * 1024)).toFixed(2); // MB

    return (
      <Box 
        sx={{
          display: 'flex',
          alignItems: 'center',
          bgcolor: colors.grey[800],
          p: 1,
          mb: 1,
          borderRadius: '4px'
        }}
      >
        {fileType === 'image' ? (
          <ImageIcon sx={{ mr: 1 }} />
        ) : (
          <InsertDriveFileIcon sx={{ mr: 1 }} />
        )}
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="body2">{fileName}</Typography>
          <Typography variant="caption">{fileSize} MB</Typography>
        </Box>
        <IconButton size="small" onClick={removeFile}>
          <CancelIcon fontSize="small" />
        </IconButton>
      </Box>
    );
  };

  const renderMessageContent = (msg) => {
    if (!msg) return null;
    
    if (msg.file) {
      return (
        <Box>
          {msg.isUploading ? (
            <Typography variant="body2">Uploading {msg.file.filename}...</Typography>
          ) : (
            <a 
              href={msg.file.url} 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ color: 'inherit', textDecoration: 'none' }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <InsertDriveFileIcon sx={{ mr: 1 }} />
                <Typography variant="body2">
                  {msg.file.filename}
                </Typography>
              </Box>
            </a>
          )}
          {msg.text && <Typography variant="body1">{msg.text}</Typography>}
        </Box>
      );
    }
    return <Typography variant="body1">{msg.text || ''}</Typography>;
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
        p: 1, 
        mb: 1, 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between", 
        borderRadius: "10px" 
      }}>
        <Box>
          <Typography variant="subtitle1">
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
          maxHeight: "48vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {messages.filter(msg => msg && msg.sender).map((msg, index) => {
          const isMyMessage = msg.sender === user._id;
          const messageDate = msg.createdAt ? new Date(msg.createdAt) : new Date();
          
          return (
            <Box
              key={msg._id || index}
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
              {renderMessageContent(msg)}
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

      {/* Message Input with File Upload */}
      <Box 
        display="flex" 
        flexDirection="column" 
        mt={2} 
        bgcolor="white" 
        p={1} 
        borderRadius="10px"
      >
        {selectedFile && renderFilePreview()}
        
        <Box display="flex" alignItems="center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
            id="file-upload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload">
            <Tooltip title="Attach file">
              <IconButton component="span" disabled={isSending}>
                <AttachFileIcon />
              </IconButton>
            </Tooltip>
          </label>
          
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type a message..."
            value={textMessage}
            onChange={(e) => setTextMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessageHandler()}
            sx={{ ml: 1, mr: 1 }}
            disabled={isSending}
          />
          
          <IconButton 
            onClick={sendMessageHandler} 
            color="primary"
            disabled={(!textMessage.trim() && !selectedFile) || isSending}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatContainer;