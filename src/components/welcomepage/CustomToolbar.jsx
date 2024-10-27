import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Box } from "@mui/material";

export default function CustomToolbar() {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#3C873A" }}>
      <Toolbar>
        {/* Logo Section */}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <img
            src="path_to_nodejs_logo"
            alt="Node.js Logo"
            style={{ height: "40px" }}
          />
        </Typography>

        {/* Navigation Links */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit">Home</Button>
          <Button color="inherit">Documentation</Button>
          <Button color="inherit">About</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
