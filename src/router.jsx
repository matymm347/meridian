import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./components/welcomepage/WelcomePage";
import App from "./components/App";
import Layout from "./components/Layout";
import DashboardPage from "./(dashboard)/thisevening/DashBoardPage";
import ThisEvening from "./(dashboard)/thisevening/ThisEvening";
import Tomorrow from "./(dashboard)/thisevening/Tomorrow";
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
            path: "/tomorrow",
            Component: Tomorrow,
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
