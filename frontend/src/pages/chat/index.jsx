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
      <Header title="Chat Management" />
      <Box
        bgcolor={colors.primary[900]}
        flexGrow={1}
        mt="2px"
        display="flex"
        borderRadius="10px"
        height="100%"
      >
        {/* Sidebar - Fixed Contacts Section */}
        <Box
          width="25%"
          minWidth="250px"
          borderRight={`1px solid ${colors.bgc[100]}`}
          display="flex"
          flexDirection="column"
        >
          {/* Fixed Header */}
          <Box
            p={1}
            fontWeight="bold"
            bgcolor={colors.bgc[200]}
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
              maxHeight: isDropdownOpen ? "400px" : "auto",
              scrollbarWidth: isDropdownOpen ? "auto" : "thin",
              transition: "max-height 0.3s ease-in-out",
            }}
          >
            <SidebarForChat
              onSelectContact={setSelectedContact}
              onDropdownToggle={setIsDropdownOpen} // Pass dropdown toggle function
            />
          </Box>
        </Box>

        {/* Chat Container - Covers Full Remaining Space */}
        <Box flexGrow={1} display="flex" flexDirection="column" height="100%">
          <ChatContainer
            selectedContact={selectedContact}
            onCloseChat={handleCloseChat}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Chat;
