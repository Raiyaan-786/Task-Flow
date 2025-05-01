import React, { useEffect, useState } from "react";
import {
  Box,
  useTheme,
  Typography,
  Divider,
  Tabs,
  Tab,
  Button,
  IconButton,
} from "@mui/material";
import { tokens } from "../../theme";
import StatBox from "../../components/StatBox";
import { ArrowBack } from "@mui/icons-material";
import { styled } from "@mui/system";
import MainDashboard from "./MainDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import WorkDashboard from "./WorkDashboard";
import CustomerDashboard from "./CustomerDashboard";
import TotalWorks from "./individualworks/TotalWorks";
import AssignedWorks from "./individualworks/AssignedWorks";
import CompletedWorks from "./individualworks/CompletedWorks";
import UnassignedWorks from "./individualworks/UnassignedWorks";
import HoldWorks from "./individualworks/HoldWorks";
import CancelledWorks from "./individualworks/CancelledWorks";
import API from "../../api/api";
import MutedWorks from "./individualworks/MutedWorks";
import GroupDashboard from "./GroupDashboard";

const Dashboard = () => {
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

  const [selectedTab, setSelectedTab] = useState(2);
  const [individualWorksTab, setIndividualWorksTab] = useState(-1);
  const [individualWorks, setIndividualWorks] = useState(false);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const [worksData, setWorksData] = useState([]);

  // Fetch works data from the backend
  useEffect(() => {
    const fetchWorksData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please log in.");
        setLoading(false);
        return;
      }
      try {
        const response = await API.get("/total-works", {
          headers: { Authorization: `Bearer ${token}` },
        }); // Replace with your API endpoint
        setWorksData(response.data); // Assuming response.data contains the array of works\
      } catch (error) {
        console.error("Error fetching works data:", error);
      }
    };

    fetchWorksData();
  }, []);

  // Calculate dynamic values
  const totalWorks = worksData.length;
  const completedWorks = worksData.filter(
    (work) => work.currentStatus === "Completed"
  ).length;
  const pendingWorks = worksData.filter(
    (work) => work.currentStatus === "Pending"
  ).length;
  const assignedWorks = worksData.filter(
    (work) => work.currentStatus === "Assigned"
  ).length;
  const unassignedWorks = worksData.filter(
    (work) => work.currentStatus === "Unassigned"
  ).length;
  const holdWorks = worksData.filter(
    (work) => work.currentStatus === "Hold Work"
  ).length;
  const cancelledWorks = worksData.filter(
    (work) => work.currentStatus === "Cancel"
  ).length;
  const mutedWorks = worksData.filter(
    (work) => work.currentStatus === "Mute"
  ).length;

  const handleStatBoxClick = (tabIndex) => {
    setIndividualWorksTab(tabIndex);
    setIndividualWorks(true);
  };

  return (
    <Box
      p={0.1}
      display="flex"
      flexDirection="column"
      height={"88%"}
      m={"10px"}
    >
      <Box
        boxShadow={1}
        bgcolor={colors.foreground[100]}
        height={"60px"}
        display={"flex"}
        borderRadius={"10px"}
        justifyContent={"space-evenly"}
      >
        <Box
          onClick={() => handleStatBoxClick(0)}
          width={"100%"}
          display={"felx"}
        >
          <StatBox value={totalWorks} title={"Total Works"} />
        </Box>
        <Divider orientation="vertical" sx={{ borderColor: colors.bgc[100] }} />
        <Box
          onClick={() => handleStatBoxClick(1)}
          width={"100%"}
          display={"felx"}
        >
          <StatBox
            value={completedWorks}
            title={"Completed"}
            textcolor={"green"}
          />
        </Box>
        <Divider orientation="vertical" sx={{ borderColor: colors.bgc[100] }} />
        {/* <Box onClick={() => handleStatBoxClick(2)} width={'100%'} display={'felx'} ><StatBox value={0} title={'Pending'} textcolor={'orange'} /></Box>
                <Divider orientation='vertical' sx={{ borderColor: colors.bgc[100] }} /> */}
        <Box
          onClick={() => handleStatBoxClick(3)}
          width={"100%"}
          display={"felx"}
        >
          <StatBox value={assignedWorks} title={"Assigned"} />
        </Box>
        <Divider orientation="vertical" sx={{ borderColor: colors.bgc[100] }} />
        <Box
          onClick={() => handleStatBoxClick(4)}
          width={"100%"}
          display={"felx"}
        >
          <StatBox value={unassignedWorks} title={"Unassigned"} />
        </Box>
        <Divider orientation="vertical" sx={{ borderColor: colors.bgc[100] }} />
        <Box
          onClick={() => handleStatBoxClick(5)}
          width={"100%"}
          display={"felx"}
        >
          <StatBox value={holdWorks} title={"Hold"} textcolor={"orange"} />
        </Box>
        <Divider orientation="vertical" sx={{ borderColor: colors.bgc[100] }} />
        <Box
          onClick={() => handleStatBoxClick(6)}
          width={"100%"}
          display={"felx"}
        >
          <StatBox
            value={cancelledWorks}
            title={"Cancelled"}
            textcolor={"red"}
          />
        </Box>
        <Divider orientation="vertical" sx={{ borderColor: colors.bgc[100] }} />
        <Box
          onClick={() => handleStatBoxClick(7)}
          width={"100%"}
          display={"felx"}
        >
          <StatBox value={mutedWorks} title={"Muted"} textcolor={"grey"} />
        </Box>
      </Box>
      {individualWorks ? (
        <Box
          bgcolor={colors.foreground[100]}
          flexGrow={1}
          mt="10px"
          display="flex"
          flexDirection="column"
          borderRadius={"10px"}
          boxShadow={1}
        >
         {/* individual boxe start */}
          <Box
            display={individualWorksTab === 0 ? "block" : "none"}
            flexGrow={1}
            height={"67vh"}
          >
            <Box
              p={1}
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
            >
              <IconButton
                onClick={() => setIndividualWorks(false)}
                size="small"
                sx={{
                  bgcolor: colors.blueHighlight[800],
                  color: "white",
                  transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition for animation
                  "&:hover": {
                    transform: "scale(1.1)", // Scales up the button by 10% on hover
                    bgcolor: colors.blueHighlight[900], // Slightly lighter shade on hover
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight={"bold"}>
                Total Works
              </Typography>
            </Box>
            <TotalWorks />
          </Box>
            {/* individual boxe start */}
         {/* individual boxe start */}
          <Box
            display={individualWorksTab === 1 ? "block" : "none"}
            flexGrow={1}
            height={"67vh"}
          >
            <Box
              p={1}
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
            >
              <IconButton
                onClick={() => setIndividualWorks(false)}
                size="small"
                sx={{
                  bgcolor: colors.blueHighlight[800],
                  color: "white",
                  transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition for animation
                  "&:hover": {
                    transform: "scale(1.1)", // Scales up the button by 10% on hover
                    bgcolor: colors.blueHighlight[900], // Slightly lighter shade on hover
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight={"bold"}>
              Completed Works
              </Typography>
            </Box>
            <CompletedWorks/>
          </Box>
            {/* individual boxe start */}
         {/* individual boxe start */}
          <Box
            display={individualWorksTab === 3 ? "block" : "none"}
            flexGrow={1}
            height={"67vh"}
          >
            <Box
              p={1}
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
            >
              <IconButton
                onClick={() => setIndividualWorks(false)}
                size="small"
                sx={{
                  bgcolor: colors.blueHighlight[800],
                  color: "white",
                  transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition for animation
                  "&:hover": {
                    transform: "scale(1.1)", // Scales up the button by 10% on hover
                    bgcolor: colors.blueHighlight[900], // Slightly lighter shade on hover
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight={"bold"}>
              Assigned Works
              </Typography>
            </Box>
            <AssignedWorks/>
          </Box>
            {/* individual boxe start */}
         {/* individual boxe start */}
          <Box
            display={individualWorksTab === 4 ? "block" : "none"}
            flexGrow={1}
            height={"67vh"}
          >
            <Box
              p={1}
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
            >
              <IconButton
                onClick={() => setIndividualWorks(false)}
                size="small"
                sx={{
                  bgcolor: colors.blueHighlight[800],
                  color: "white",
                  transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition for animation
                  "&:hover": {
                    transform: "scale(1.1)", // Scales up the button by 10% on hover
                    bgcolor: colors.blueHighlight[900], // Slightly lighter shade on hover
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight={"bold"}>
              Unassigned Works
              </Typography>
            </Box>
            <UnassignedWorks />
          </Box>
            {/* individual boxe start */}
         {/* individual boxe start */}
          <Box
            display={individualWorksTab === 5 ? "block" : "none"}
            flexGrow={1}
            height={"67vh"}
          >
            <Box
              p={1}
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
            >
              <IconButton
                onClick={() => setIndividualWorks(false)}
                size="small"
                sx={{
                  bgcolor: colors.blueHighlight[800],
                  color: "white",
                  transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition for animation
                  "&:hover": {
                    transform: "scale(1.1)", // Scales up the button by 10% on hover
                    bgcolor: colors.blueHighlight[900], // Slightly lighter shade on hover
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight={"bold"}>
              Hold Works
              </Typography>
            </Box>
            <HoldWorks />
          </Box>
            {/* individual boxe start */}
         {/* individual boxe start */}
          <Box
            display={individualWorksTab === 6 ? "block" : "none"}
            flexGrow={1}
            height={"67vh"}
          >
            <Box
              p={1}
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
            >
              <IconButton
                onClick={() => setIndividualWorks(false)}
                size="small"
                sx={{
                  bgcolor: colors.blueHighlight[800],
                  color: "white",
                  transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition for animation
                  "&:hover": {
                    transform: "scale(1.1)", // Scales up the button by 10% on hover
                    bgcolor: colors.blueHighlight[900], // Slightly lighter shade on hover
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight={"bold"}>
              Cancelled Works
              </Typography>
            </Box>
            <CancelledWorks />
          </Box>
            {/* individual boxe start */}
         {/* individual boxe start */}
          <Box
            display={individualWorksTab === 7 ? "block" : "none"}
            flexGrow={1}
            height={"67vh"}
          >
            <Box
              p={1}
              display={"flex"}
              flexDirection={"row"}
              alignItems={"center"}
              gap={2}
            >
              <IconButton
                onClick={() => setIndividualWorks(false)}
                size="small"
                sx={{
                  bgcolor: colors.blueHighlight[800],
                  color: "white",
                  transition: "transform 0.3s ease, background-color 0.3s ease", // Smooth transition for animation
                  "&:hover": {
                    transform: "scale(1.1)", // Scales up the button by 10% on hover
                    bgcolor: colors.blueHighlight[900], // Slightly lighter shade on hover
                  },
                }}
              >
                <ArrowBack />
              </IconButton>
              <Typography variant="h4" fontWeight={"bold"}>
              Muted Work
              </Typography>
            </Box>
            <MutedWorks />
          </Box>
            {/* individual boxe start */}
        </Box>
      ) : (
        <Box
          //this is box 2
          bgcolor={colors.foreground[100]}
          flexGrow={1}
          mt="10px"
          display="flex"
          flexDirection="column"
          borderRadius={"10px"}
          boxShadow={1}
        >
          {/* Rounded Tabs */}
          <RoundedTabs value={selectedTab} onChange={handleTabChange}>
            <RoundedTab label="Main Dashboard" />
            <RoundedTab label="Employee Dashboard" />
            <RoundedTab label="Work Dashboard" />
            <RoundedTab label="Customer Dashboard" />
            <RoundedTab label="Customer Group Dashboard" />
          </RoundedTabs>
          {/* <Divider sx={{ borderColor: colors.bgc[100] }} /> */}
          {/* Render All Tab Panels Once */}
          <Box
            p="0 1px"
            flexGrow={1}
            position="relative"
            display="flex"
            flexDirection="column"
            height={"90%"}
          >
            <Box
              display={selectedTab === 0 ? "block" : "none"}
              flexGrow={1}
              height={"67vh"}
            >
              <MainDashboard />
            </Box>

            <Box
              display={selectedTab === 1 ? "block" : "none"}
              flexGrow={1}
              height={"67vh"}
            >
              <EmployeeDashboard />
            </Box>

            <Box
              display={selectedTab === 2 ? "block" : "none"}
              flexGrow={1}
              height={"67vh"}
            >
              <WorkDashboard />
            </Box>

            <Box
              display={selectedTab === 3 ? "block" : "none"}
              flexGrow={1}
              height={"67vh"}
            >
              <CustomerDashboard />
            </Box>
            <Box
              display={selectedTab === 4 ? "block" : "none"}
              flexGrow={1}
              height={"67vh"}
            >
              <GroupDashboard />
            </Box>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Dashboard;
