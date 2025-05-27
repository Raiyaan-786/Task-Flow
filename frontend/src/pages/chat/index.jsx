import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
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
      // bgcolor={"red"}
    >
      {/* Fixed Header */}
      <Header title="Chat Management" />

      {/* Main Chat Container */}
      <Box
        boxShadow={1}
        bgcolor={colors.foreground[100]}
        flexGrow={1}
        mt="2px"
        // bgcolor="orange"
        display="flex"
        flexDirection="row"
        borderRadius="10px"
        height={"100%"}
        overflow="hidden" // Prevents entire page from scrolling
      >
       
        <Box
          width="25%"
          minWidth="250px"
          borderRight={`1px solid ${colors.bgc[200]}`}
          display="flex"
          flexDirection="column"
          flexShrink={0} // Prevents shrinking when chat expands
          // bgcolor={"black"}
        >
          

          <Typography variant="h3" sx={{ p: 2, fontWeight: "bold" }}>
              Contacts
            </Typography>
         
          <Box
            flexGrow={1}
            overflow="auto"
            p={1}
            sx={{
              maxHeight: isDropdownOpen ? "400px" : "100%",
              scrollbarWidth: isDropdownOpen ? "auto" : "thin",
              
              
              transition: "max-height 0.3s ease-in-out",
              // bgcolor:colors.bgc[100],
               '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: colors.foreground[100],
              },
              '&::-webkit-scrollbar-thumb': {
                background: colors.blueHighlight[900],
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: colors.blueHighlight[800],
              },
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
          // p="0 10px"
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
