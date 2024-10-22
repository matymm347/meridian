import { useState, useEffect } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import AppAppBar from "./components/AppAppBar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

export default function WelcomePage() {
  const [mode, setMode] = useState("dark");
  const theme = createTheme({
    palette: { mode },
    typography: {
      fontFamily: "Roboto, Arial, sans-serif",
    },
  });

  const handleModeChange = () => {
    setMode((prevMode) => {
      const newMode = prevMode === "dark" ? "light" : "dark";
      localStorage.setItem("themeMode", newMode);
      return newMode;
    });
  };

  // Determine the system color preference
  useEffect(() => {
    // Check if there is a preferred mode in localStorage
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    } else {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setMode("dark");
        localStorage.setItem("themeMode", "dark");
      } else {
        setMode("light");
        localStorage.setItem("themeMode", "light");
      }
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", height: "100dvh", flexDirection: "column" }}>
        <AppAppBar handleModeChange={handleModeChange} />
        <Box sx={{ flexGrow: "1" }}>
          <Hero />
        </Box>
        <Footer />
      </Box>
    </ThemeProvider>
  );
}
