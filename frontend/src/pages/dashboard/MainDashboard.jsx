import { useTheme } from "@emotion/react";
import { Box, Typography } from "@mui/material";
import React from "react";
import { tokens } from "../../theme";

const MainDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <Box p={2}>
      <Box
        bgcolor={colors.blueHighlight[800]}
        boxShadow={3}
        width={160}
        height={100}
        borderRadius={3}
        color={"white"}
        display={"flex"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Typography variant="h3" fontWeight={"bold"}>
          Master Data
        </Typography>
      </Box>
    </Box>
  );
};

export default MainDashboard;
