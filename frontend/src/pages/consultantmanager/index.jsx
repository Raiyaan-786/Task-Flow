import React, { useState } from "react";
import { Box, Divider, styled, Tab, Tabs } from "@mui/material";
import Header from "../../components/Header";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import AddConsultant from "./AddConsultant";
import ConsultantList from "./ConsultantList";

const ConsultantManager = () => {
  const RoundedTabs = styled(Tabs)({
    padding: "10px",
    minHeight: "40px",
    "& .MuiTabs-indicator": {
      display: "none", // Remove the default indicator
    },
  });

  const RoundedTab = styled(Tab)(({ theme }) => ({
    marginRight: "5px",
    textTransform: "none",
    fontWeight: 400,
    borderRadius: "10px",
    minHeight: "35px",
    padding: "0px 10px",
    color: "obsidian",
    "&.Mui-selected": {
      backgroundColor: colors.blueHighlight[900],
      color: "white",
    },
  }));

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [selectedTab, setSelectedTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  // Function to render the content of the active tab
  const renderTabContent = () => {
    switch (selectedTab) {
      case 0:
        return <AddConsultant />;
      case 1:
        return <ConsultantList />;
      default:
        return null;
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="88%"
      margin="10px"
      p={0.1}
    >
      <Header title="Consultant Management" />
      <Box
        boxShadow={1}
        bgcolor={colors.foreground[100]}
        flexGrow={1}
        mt="2px"
        display="flex"
        flexDirection="column"
        borderRadius="10px"
      >
        {/* Rounded Tabs */}
        <RoundedTabs value={selectedTab} onChange={handleTabChange}>
          <RoundedTab label="Add Consultant" />
          <RoundedTab label="Consultant List" />
        </RoundedTabs>
        {/* <Divider sx={{ borderColor: colors.bgc[100] }} /> */}
        {/* Render only the selected tab content */}
        <Box
         p="0 1px"
         flexGrow={1}
         position="relative"
         display="flex"
         flexDirection="column"
         height={'67vh'}
        >
          {renderTabContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default ConsultantManager;
