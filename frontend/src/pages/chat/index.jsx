import React, { useState } from "react";
import { Box } from "@mui/material";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import SidebarForChat from "./SidebarForChat";
import ChatContainer from "./ChatContainer";

const Chat = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedContact, setSelectedContact] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleCloseChat = () => {
    setSelectedContact(null);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="88%"
      margin="10px"
      p={0.1}
    >
      {/* Fixed Header */}
      <Header title="Chat Management" />

      {/* Main Chat Container */}
      <Box
        boxShadow={1}
        bgcolor={colors.foreground[100]}
        flexGrow={1}
        mt="2px"
        display="flex"
        flexDirection="row"
        borderRadius="10px"
        overflow="hidden" // Prevents entire page from scrolling
      >
        {/* Sidebar - Fixed Contacts Section */}
        <Box
          width="25%"
          minWidth="250px"
          borderRight={`1px solid ${colors.foreground[100]}`}
          display="flex"
          flexDirection="column"
          flexShrink={0} // Prevents shrinking when chat expands
        >
          {/* Contacts Header */}
          <Box
            p={1}
            fontWeight="bold"
            bgcolor={colors.foreground[100]}
            textAlign="center"
            fontSize="1.1rem"
          >
            Contacts
          </Box>

          {/* Scrollable Contacts List */}
          <Box
            flexGrow={1}
            overflow="auto"
            p={1}
            sx={{
              maxHeight: isDropdownOpen ? "400px" : "100%",
              scrollbarWidth: isDropdownOpen ? "auto" : "thin",
              transition: "max-height 0.3s ease-in-out",
            }}
          >
            <SidebarForChat
              onSelectContact={setSelectedContact}
              onDropdownToggle={setIsDropdownOpen}
            />
          </Box>
        </Box>

        {/* Chat Container (Only this part should scroll) */}
        <Box
          flexGrow={1}
          display="flex"
          flexDirection="column"
          height="100%"
          p="0 10px"
          overflow="hidden" // Prevents full page scrolling
        >
          <ChatContainer
            selectedContact={selectedContact}
            onCloseChat={handleCloseChat}
            style={{ flexGrow: 1, overflowY: "auto" }} // Scrolls only ChatContainer
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
