import React from "react";
import { Box, Typography, Card, CardMedia, CardContent, CardActionArea } from "@mui/material";
import { useTheme } from "@emotion/react";
import { tokens } from "../../theme";
import { useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";

// Animation for the welcome message
const fadeIn = keyframes`
  0% { opacity: 0; transform: translateY(-20px); }
  100% { opacity: 1; transform: translateY(0); }
`;

const HomePage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();

  const handleTaskflowClick = () => {
    navigate("/");
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: colors.foreground[100],
        p: 3,
        overflow: "auto",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        color={colors.blueHighlight[900]}
        sx={{
          fontWeight: 700,
          animation: `${fadeIn} 1s ease-out`,
          textAlign: "center",
          background: `linear-gradient(45deg, ${colors.blueHighlight[900]} 30%, ${colors.blueHighlight[700]} 90%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Welcome to Your Tenant Homepage
      </Typography>
      <Card
        sx={{
          width: 500,
          borderRadius: 4,
          boxShadow: `0 8px 24px ${colors.grey[900]}33`,
          overflow: "hidden",
          transition: "transform 0.4s ease, box-shadow 0.4s ease",
          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: `0 16px 32px ${colors.grey[900]}66`,
          },
          position: "relative",
          mt: 4,
        }}
      >
        <CardActionArea onClick={handleTaskflowClick}>
          <CardMedia
            component="img"
            height="300"
            image="/tfscreenshot.png" // Updated to use public folder path
            alt="Taskflow Screenshot"
            sx={{
              objectFit: "cover",
              filter: "brightness(0.95)",
              transition: "filter 0.3s ease",
              "&:hover": {
                filter: "brightness(1.05)",
              },
            }}
            onError={(e) => {
              console.error("Image failed to load:", e);
              e.target.src = "https://via.placeholder.com/500x300?text=Image+Not+Found";
            }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: "rgba(0, 0, 0, 0.3)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              opacity: 0,
              transition: "opacity 0.3s ease",
              "&:hover": {
                opacity: 1,
              },
            }}
          >
            <Typography
              variant="h5"
              color="white"
              sx={{ fontWeight: 600, textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)" }}
            >
              Click to Login to Taskflow
            </Typography>
          </Box>
          <CardContent
            sx={{
              textAlign: "center",
              bgcolor: colors.blueHighlight[50],
              py: 3,
            }}
          >
            <Typography
              variant="h6"
              fontWeight={600}
              color={colors.blueHighlight[900]}
            >
              Access Your Taskflow
            </Typography>
            <Typography
              variant="body2"
              color={colors.grey[500]}
              sx={{ mt: 1 }}
            >
              Manage your tasks and workflows with ease—click to get started!
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Box>
  );
};

export default HomePage;