import "./App.css";
import WimmerTablePage from "./WimmerTable/WimmerTablePage";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import logo from "./logo.svg";

function App() {
  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <img className="w-10" src={logo} alt="Logo" />
          </Toolbar>
        </AppBar>
      </Box>
      <WimmerTablePage />
    </>
  );
}

export default App;
