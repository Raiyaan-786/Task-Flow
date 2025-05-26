import { createContext, useState, useMemo } from "react";
import { createTheme } from "@mui/material/styles";

// #0065e2
//new color palette start
// teal: {
//     100: "#ccf3ff",
//     200: "#99e7ff",
//     300: "#66daff",
//     400: "#33ceff",
//     500: "#00c2ff",
//     600: "#009bcc",
//     700: "#007499",
//     800: "#004e66",
//     900: "#002733"
// },
// pink: {
//     100: "#f5d8ff",
//     200: "#eab1ff",
//     300: "#e08aff",
//     400: "#d563ff",
//     500: "#cb3cff",
//     600: "#a230cc",
//     700: "#7a2499",
//     800: "#511866",
//     900: "#290c33"
// },
//new color palette end

// #007aff

//color design tokens
export const tokens =(mode)=>({
    ...(mode === 'dark'
        ?{grey: {
            100: "#e0e0e0",
            200: "#c2c2c2",
            300: "#a3a3a3",
            400: "#858585",
            500: "#666666",
            600: "#525252",
            700: "#3d3d3d",
            800: "#292929",
            900: "#141414"
        },
        primary: {
            100: "#d0d1d5",
            200: "#a1a4ab",
            300: "#727681",
            400: "#1F2A40",
            500: "#141b2d",
            600: "#101624",
            700: "#0c101b",
            800: "#080b12",
            900: "#040509"
        },
        greenAccent: {
            100: "#dbf5ee",
            200: "#b7ebde",
            300: "#94e2cd",
            400: "#70d8bd",
            500: "#4cceac",
            600: "#3da58a",
            700: "#2e7c67",
            800: "#1e5245",
            900: "#0f2922"
        },
        redAccent: {
            100: "#f8dcdb",
            200: "#f1b9b7",
            300: "#e99592",
            400: "#e2726e",
            500: "#db4f4a",
            600: "#af3f3b",
            700: "#832f2c",
            800: "#58201e",
            900: "#2c100f"
        },
        blueAccent: {
            100: "#e1e2fe",
            200: "#c3c6fd",
            300: "#a4a9fc",
            400: "#868dfb",
            500: "#6870fa",
            600: "#535ac8",
            700: "#3e4396",
            800: "#2a2d64",
            900: "#151632"
        },
        teal: {
          100: "#ccf3ff",
          200: "#99e7ff",
          300: "#66daff",
          400: "#33ceff",
          500: "#00c2ff",
          600: "#009bcc",
          700: "#007499",
          800: "#004e66",
          900: "#002733"
      },
      pink: {
          100: "#f5d8ff",
          200: "#eab1ff",
          300: "#e08aff",
          400: "#d563ff",
          500: "#cb3cff",
          600: "#a230cc",
          700: "#7a2499",
          800: "#511866",
          900: "#290c33"
      },
      blueHighlight: {
        100: "#e6efff", // Very light, near-white blue for subtle highlights
        200: "#cce0ff", // Light blue, soft highlight for backgrounds
        300: "#b2d1ff", // Slightly more vibrant, for hover states
        400: "#99c2ff", // Bright highlight for interactive elements
        500: "#7fb3ff", // Mid-tone, strong highlight color
        600: "#66a4ff", // Bold blue for prominent highlights
        700: "#4c95ff", // Deeper blue for contrast in highlights
        800: "#3386ff", // Darker, intense highlight for focus states
        900: "#0065e2"  // Darkest, vivid blue (base color) for strong emphasis
      },
      chatclr:{
        100:"#3b44d9", 
      },
      bgc:{
        100:"#121212",
        200:"#121212",
      },
      foreground:{
         100:"#1d1d1d"
      },
      sidebarHover:{
         100:"#121212"
      }
      }:{
            grey: {
                100: "#141414",
                200: "#292929",
                300: "#3d3d3d",
                400: "#525252",
                500: "#666666",
                600: "#858585",
                700: "#a3a3a3",
                800: "#c2c2c2",
                900: "#e0e0e0",
            },
            primary: {
                100: "#040509",
                200: "#080b12",
                300: "#0c101b",
                400: "#f2f0f0", //manually changed
                500: "#141b2d",
                600: "#f2f0f0", //manually changed
                700: "#f2f0f0", //manually changed
                800: "#a1a4ab",
                900: "#e9e9eb", //manually changed
            },
            greenAccent: {
                100: "#0f2922",
                200: "#1e5245",
                300: "#2e7c67",
                400: "#3da58a",
                500: "#4cceac",
                600: "#70d8bd",
                700: "#94e2cd",
                800: "#b7ebde",
                900: "#dbf5ee",
            },
            redAccent: {
                100: "#2c100f",
                200: "#58201e",
                300: "#832f2c",
                400: "#af3f3b",
                500: "#db4f4a",
                600: "#e2726e",
                700: "#e99592",
                800: "#f1b9b7",
                900: "#f8dcdb",
            },
            blueAccent: {
                100: "#151632",
                200: "#2a2d64",
                300: "#3e4396",
                400: "#535ac8",
                500: "#6870fa",
                600: "#868dfb",
                700: "#a4a9fc",
                800: "#c3c6fd",
                900: "#e1e2fe",
            },
            teal: {
              100: "#002733",
              200: "#004e66",
              300: "#007499",
              400: "#009bcc",
              500: "#00c2ff",
              600: "#33ceff",
              700: "#66daff",
              800: "#99e7ff",
              900: "#ccf3ff",
          },
          pink: {
            100: "#290c33",
            200: "#511866",
            300: "#7a2499",
            400: "#a230cc",
            500: "#cb3cff",
            600: "#d563ff",
            700: "#e08aff",
            800: "#eab1ff",
            900: "#f5d8ff",
          },
          blueHighlight: {
            100: "#e6efff", // Very light, near-white blue for subtle highlights
            200: "#cce0ff", // Light blue, soft highlight for backgrounds
            300: "#b2d1ff", // Slightly more vibrant, for hover states
            400: "#99c2ff", // Bright highlight for interactive elements
            500: "#7fb3ff", // Mid-tone, strong highlight color
            600: "#66a4ff", // Bold blue for prominent highlights
            700: "#4c95ff", // Deeper blue for contrast in highlights
            800: "#3386ff", // Darker, intense highlight for focus states
            900: "#0065e2" , // Darkest, vivid blue (base color) for strong emphasis
            1000:"#2563eb"
          },
           chatclr:{
        100:"#e5e9ff", 
      },
          bgc:{
            100:"#f0f0f0",
            200:"#ececec"

            // 100:"#f9f8f8"
          },
          foreground:{
             100:"#FAF9F6"
            //  100:"#ffff"
          },
          sidebarHover:{
            100:"#e6efff"
         }
        }
    )
})

//mui theme settings
export const themeSettings = (mode) => {
    const colors = tokens(mode);
    return {
      palette: {
        mode: mode,
        ...(mode === "dark"
          ? {
              // palette values for dark mode
              primary: {
                main: colors.primary[500],
              },
              secondary: {
                main: colors.greenAccent[500],
              },
              neutral: {
                dark: colors.grey[700],
                main: colors.grey[500],
                light: colors.grey[100],
              },
              background: {
                default: colors.bgc[100],
              },
            }
          : {
              // palette values for light mode
              primary: {
                main: colors.primary[100],
              },
              secondary: {
                main: colors.greenAccent[500],
              },
              neutral: {
                dark: colors.grey[700],
                main: colors.grey[500],
                light: colors.grey[100],
              },
              background: {
                default: colors.bgc[100],
              },
            }),
      },
      typography: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 12,
        h1: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 40,
        },
        h2: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 32,
        },
        h3: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 24,
        },
        h4: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 20,
        },
        h5: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 16,
        },
        h6: {
          fontFamily: ["Inter", "sans-serif"].join(","),
          fontSize: 14,
        },
      },
    };
  };
  
  // context for color mode
  export const ColorModeContext = createContext({
    toggleColorMode: () => {},
  });
  
  export const useMode = () => {
    const [mode, setMode] = useState("light");
  
    const colorMode = useMemo(
      () => ({
        toggleColorMode: () =>
          setMode((prev) => (prev === "light" ? "dark" : "light")),
      }),
      []
    );
  
    const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
    return [theme, colorMode];
  };
