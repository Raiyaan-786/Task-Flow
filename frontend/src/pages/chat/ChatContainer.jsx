import React, { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Tooltip,
  Button,
  Modal,
  Avatar,
} from "@mui/material";
import {
  Send as SendIcon,
  Close as CloseIcon,
  AttachFile as AttachFileIcon,
  InsertDriveFile as InsertDriveFileIcon,
  Image as ImageIcon,
  Cancel as CancelIcon,
  GetApp as DownloadIcon,
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
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
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
          withCredentials: true,
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

      if (
        [newMessage.sender, newMessage.receiver].includes(selectedUser?._id)
      ) {
        dispatch(setMessages([...messages, newMessage]));

        if (newMessage.sender === selectedUser._id) {
          dispatch(markNotificationAsRead({ chatId: newMessage.chatId }));
        }
      }
    };

    const handleNewNotification = (notification) => {
      dispatch(addNotification(notification));

      if (
        notification.message?.chatId !== selectedUser?._id &&
        document.visibilityState !== "visible"
      ) {
        new Notification("New message", {
          body: notification.content,
          icon: notification.sender?.avatar,
        });
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newNotification", handleNewNotification);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, selectedUser, messages, dispatch]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("File size too large (max 10MB)");
      return;
    }
    setSelectedFile(file);
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sendMessageHandler = async () => {
    if ((!textMessage.trim() && !selectedFile) || isSending) return;

    setIsSending(true);
    const formData = new FormData();
    if (textMessage) formData.append("text", textMessage);
    if (selectedFile) {
      formData.append("file", selectedFile);
      formData.append(
        "resource_type",
        selectedFile.type === "application/pdf" ? "raw" : "image"
      );
    }

    const tempId = Date.now().toString();
    const tempMessage = {
      _id: tempId,
      sender: user._id,
      receiver: selectedUser._id,
      text: textMessage,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
      file: selectedFile
        ? {
            filename: selectedFile.name,
            isUploading: true,
          }
        : null,
    };

    dispatch(setMessages([...messages, tempMessage]));
    setTextMessage("");
    setSelectedFile(null);

    try {
      const response = await API.post(
        `/message/send/${selectedUser._id}`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data?.newMessage) {
        dispatch(
          setMessages([
            ...messages.filter((m) => m._id !== tempId),
            response.data.newMessage,
          ])
        );
      }
    } catch (error) {
      console.error("Error sending message:", error);
      dispatch(setMessages(messages.filter((m) => m._id !== tempId)));
    } finally {
      setIsSending(false);
    }
  };

  const renderFilePreview = () => {
    if (!selectedFile) return null;

    const fileType = selectedFile.type?.split("/")[0] || "file";
    const fileName = selectedFile.name;
    const fileSize = (selectedFile.size / (1024 * 1024)).toFixed(2); // MB

    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          bgcolor: colors.foreground[100],
          p: 1,
          mb: 1,
          borderRadius: "40px",
          bgcolor: colors.chatclr[100],
          width: "400px",
        }}
      >
        {fileType === "image" ? (
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

  // MIME type mapping for common file types
  const mimeTypeMap = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
  };

  const handleDownload = async (fileUrl, fileName) => {
    setIsDownloading(true);
    try {
      let correctedUrl = fileUrl;
      if (fileName.endsWith(".pdf") && fileUrl.includes("/image/upload")) {
        correctedUrl = fileUrl.replace("/image/upload", "/raw/upload");
      }

      const response = await fetch(correctedUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch file: ${response.statusText}`);
      }

      const contentType =
        response.headers.get("Content-Type") || "application/octet-stream";
      const fileExtension = fileName?.split(".").pop()?.toLowerCase();
      const mimeType = mimeTypeMap[fileExtension] || contentType;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: mimeType })
      );

      const a = document.createElement("a");
      a.href = url;
      a.download = fileName || `download.${fileExtension || "file"}`;
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleOpenImage = (url) => {
    setSelectedImageUrl(url);
    setOpenImageModal(true);
  };

  const handleOpenFile = (url, fileName) => {
    // For PDFs, use corrected URL if necessary
    let correctedUrl = url;
    if (fileName.endsWith(".pdf") && url.includes("/image/upload")) {
      correctedUrl = url.replace("/image/upload", "/raw/upload");
    }
    window.open(correctedUrl, "_blank");
  };

  const handleCloseImageModal = () => {
    setOpenImageModal(false);
    setSelectedImageUrl("");
  };

  const renderMessageContent = (msg) => {
    if (!msg) return null;

    if (msg.file) {
      const isImage =
        msg.file.fileType === "image" ||
        msg.file.filename?.match(/\.(jpg|jpeg|png|gif)$/i);

      return (
        <Box>
          {msg.isUploading ? (
            <Typography variant="body2">
              Uploading {msg.file.filename}...
            </Typography>
          ) : (
            <Box>
              {isImage ? (
                <Box
                  sx={{
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": { opacity: 0.9 },
                  }}
                  onClick={() => handleOpenImage(msg.file.url)}
                >
                  <img
                    src={msg.file.url}
                    alt={msg.file.filename}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "8px",
                      objectFit: "contain",
                    }}
                  />
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    mb: 1,
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: colors.grey[700],
                      borderRadius: "4px",
                    },
                  }}
                  onClick={() =>
                    handleOpenFile(msg.file.url, msg.file.filename)
                  }
                >
                  <InsertDriveFileIcon sx={{ mr: 1 }} />
                  <Typography variant="body2">{msg.file.filename}</Typography>
                </Box>
              )}
              <Button
                disabled={isDownloading}
                variant="contained"
                size="small"
                startIcon={<DownloadIcon />}
                onClick={() => handleDownload(msg.file.url, msg.file.filename)}
                className="gradient-button"
                sx={{
                  mt: 1,
                  mb: 1,
                  textTransform: "none",
                  bgcolor: colors.primary[500],
                  "&:hover": {
                    bgcolor: colors.primary[300],
                  },
                }}
              >
                {isDownloading ? "Downloading..." : "Download"}
              </Button>
            </Box>
          )}
          {msg.text && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              {msg.text}
            </Typography>
          )}
        </Box>
      );
    }
    return <Typography variant="body1">{msg.text || ""}</Typography>;
  };

  if (!selectedUser) {
    return (
      <Box
        flexGrow={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgcolor={colors.bgc[100]}
        sx={{
          backgroundImage: `url("/chatbgc.webp")`,
          backgroundSize: "fill",
          backgroundPosition: "center",
          opacity: 0.4,
        }}
      >
        <Typography variant="h3" color="black" >
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
      // p={2}
      bgcolor={colors.bgc[100]}
      borderRadius="10px"
      justifyContent={"space-between"}
      // sx={{ bgcolor:'red'}}
      
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 1,
          // mb: 1,
          pl: 2,
          pr: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          // borderRadius: "5px",
          height: "10%",
          bgcolor: colors.foreground[100],
          
          zIndex: 10,
          boxShadow: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar src={selectedUser.image} sx={{ width: 45, height: 45 }} />
          <Box p={1}>
            <Typography variant="h5">
              {selectedUser.name} ({selectedUser.role})
              {onlineUsers.includes(selectedUser._id) && (
                <span style={{ color: "green", marginLeft: "8px" }}>
                  Online
                </span>
              )}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {selectedUser.email}
            </Typography>
          </Box>
        </Box>
        <IconButton
          onClick={() => dispatch(setSelectedUser(null))}
          // color="error"
        >
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Messages Container */}
      <Box
        flexGrow={1}
        overflow="auto"
        p={"0px 50px"}
        // bgcolor={colors.bgc[100]}
        

        sx={{
          height: "20vh",
          display: "flex",
          flexDirection: "column",
          // backgroundImage:`url("/chatbgc2.png")`,
          // backgroundColor: colors.bgc[100],
          // border:`1px solid ${colors.grey[700]}`,
          
        }}
      >
        {messages
          .filter((msg) => msg && msg.sender)
          .map((msg, index) => {
            const isMyMessage = msg.sender === user._id;
            const messageDate = msg.createdAt
              ? new Date(msg.createdAt)
              : new Date();

            return (
              <Box
                key={msg._id || index}
                sx={{
                  mb: 1.5,
                  p: 1.5,
                  borderRadius: "6px",
                  bgcolor: isMyMessage
                  ? colors.chatclr[200]
                    : colors.chatclr[100],
                    // : colors.foreground[100],
                  // color: isMyMessage ? "white" : "black",
                  alignSelf: isMyMessage ? "flex-end" : "flex-start",
                  marginLeft: isMyMessage ? "auto" : 0,
                  marginRight: isMyMessage ? 0 : "auto",
                  maxWidth: "60%",
                  wordBreak: "break-word",
                  // border: `.5px solid ${colors.grey[700]}`,
                  boxShadow: 1,
                }}
              >
                {renderMessageContent(msg)}
                <Typography
                  variant="caption"
                  display="block"
                  sx={{
                    textAlign: isMyMessage ? "right" : "left",
                  }}
                >
                  {messageDate.toString() !== "Invalid Date"
                    ? messageDate.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Just now"}
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
        justifyContent="center"
        // mt={2}
        // height={"10%"}
        bgcolor={colors.foreground[100]}
        m={2}
        mt={0}
        // p={1}
        sx={{
          p: selectedFile ? 4 : 1,
        }}
        borderRadius="90px"
        boxShadow={2}
      >
        {selectedFile && renderFilePreview()}

        <Box display="flex" alignItems="center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            id="file-upload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          />
          <label htmlFor="file-upload">
            <Tooltip title="Attach file">
              <IconButton
                sx={{ color: "white", height: "50px", width: "50px" }}
                className="gradient-button"
                component="span"
                disabled={isSending}
              >
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
            onKeyPress={(e) => e.key === "Enter" && sendMessageHandler()}
            sx={{
              ml: 2,
              mr: 2,
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  border: "none", // Remove border
                },
                "&:hover fieldset": {
                  border: "none", // Remove border on hover
                },
                "&.Mui-focused fieldset": {
                  border: "none", // Remove border on focus
                },
              },
            }}
            disabled={isSending}
          />

          <IconButton
            className="gradient-button"
            onClick={sendMessageHandler}
            sx={{ color: "white", height: "50px", width: "50px" }}

            // disabled={(!textMessage.trim() && !selectedFile) || isSending}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Image Preview Modal */}
      <Modal
        open={openImageModal}
        onClose={handleCloseImageModal}
        aria-labelledby="image-preview-modal"
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <Box
          sx={{
            position: "relative",
            maxWidth: "90vw",
            maxHeight: "90vh",
            // bgcolor: "black",
            // borderRadius: "8px",
            overflow: "hidden",
          }}
        >
          <img
            src={selectedImageUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "fill",
            }}
          />
          <IconButton
            onClick={handleCloseImageModal}
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
            }}
          >
            <CloseIcon />
          </IconButton>
          <IconButton
            onClick={() => handleDownload(selectedImageUrl, "image.jpg")}
            sx={{
              position: "absolute",
              top: 8,
              right: 48,
              color: "white",
              bgcolor: "rgba(0,0,0,0.5)",
            }}
          >
            <DownloadIcon />
          </IconButton>
        </Box>
      </Modal>
    </Box>
  );
};

export default ChatContainer;
