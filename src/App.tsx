import "./App.css";
import WimmerTablePage from "./WimmerTable/WimmerTablePage";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import logo from "./logo.svg";

function App() {
  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundImage:
            "radial-gradient(circle,rgba(94, 66, 135, 1) 0%, rgba(17, 21, 36, 1) 100%)",
          border: "1px solid rgba(255, 255, 255, 0.2)", // subtle semi-transparent border
        }}
      >
        <Toolbar>
          <img className="w-10" src={logo} alt="Logo" />
          <Typography variant="h5" sx={{ paddingLeft: "20px" }}>
            Meridian
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ paddingTop: "60px" }}>
        <WimmerTablePage />
      </Box>
    </>
  );
}

export default App;
