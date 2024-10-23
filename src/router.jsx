import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./WelcomePage";
// import ObservationLauncher from "./components/ObservationLauncher";
import App from "./components/App";
import Layout from "./components/Dashboard";
import DashboardPage from "./components/DashBoardPage";
import ThisEvening from "./(dashboard)/thisevening/ThisEvening";
import Tommorow from "./(dashboard)/thisevening/Tommorow";
import MeridianChoice from "./(dashboard)/thisevening/MeridianChoice";
import AdvancedFinder from "./(dashboard)/thisevening/AdvancedFinder";

const router = createBrowserRouter([
  {
    Component: App,
    children: [
      {
        path: "/",
        Component: Layout,
        children: [
          {
            path: "/",
            Component: DashboardPage,
          },
          {
            path: "/thisevening",
            Component: ThisEvening,
          },
          {
            path: "/tommorow",
            Component: Tommorow,
          },
          {
            path: "/meridianchoice",
            Component: MeridianChoice,
          },
          {
            path: "/advancedfinder",
            Component: AdvancedFinder,
          },
        ],
      },
    ],
  },
  {
    path: "/welcomepage",
    Component: WelcomePage,
  },
]);

export { router };