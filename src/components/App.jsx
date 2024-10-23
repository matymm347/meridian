import DashboardIcon from "@mui/icons-material/Dashboard";
import NightlightIcon from "@mui/icons-material/Nightlight";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { AppProvider } from "@toolpad/core/react-router-dom";
import { Outlet } from "react-router-dom";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "thisevening",
    title: "This evening",
    icon: <NightlightIcon />,
  },
  {
    segment: "tommorow",
    title: "Tommorow",
    icon: <NavigateNextIcon />,
  },
  {
    segment: "meridianchoice",
    title: "Meridian choice",
    icon: <StarOutlineIcon />,
  },
  {
    segment: "advancedfinder",
    title: "Advanced finder",
    icon: <AutoAwesomeIcon />,
  },
];

const BRANDING = {
  title: "My Toolpad Core App",
};

export default function App() {
  return (
    <AppProvider navigation={NAVIGATION} branding={BRANDING}>
      <Outlet />
    </AppProvider>
  );
}
