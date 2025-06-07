import MeridianIcon from "./MeridianIcon";
import DashboardIcon from "@mui/icons-material/Dashboard";
import NightlightIcon from "@mui/icons-material/Nightlight";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import { AppProvider } from "@toolpad/core/react-router-dom";
import { Outlet } from "react-router-dom";
import { createTheme } from "@mui/material/styles";

const NAVIGATION = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Wimmer Table Finder",
    icon: <DashboardIcon />,
  },
  {
    segment: "thisevening",
    title: "This evening",
    icon: <NightlightIcon />,
  },
  {
    segment: "tomorrow",
    title: "Tomorrow",
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

const customTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: "data-toolpad-color-scheme",
  },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: "#9774B4",
        },
        background: {
          default: "#FEF7FF",
          paper: "#F2ECF4",
        },
      },
    },
    dark: {
      palette: {
        primary: {
          main: "#D2BCFF",
        },
        background: {
          default: "#211F24",
          paper: "#141218",
        },
      },
    },
  },
});

const darkTheme = createTheme({
  background: {
    default: "#141218",
  },
});

export default function App() {
  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{ logo: <MeridianIcon />, title: "Meridian" }}
      theme={customTheme}
    >
      <Outlet />
    </AppProvider>
  );
}
