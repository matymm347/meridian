import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./WelcomePage";
// import ObservationLauncher from "./components/ObservationLauncher";
import App from "./components/App";
import Layout from "./components/Dashboard";
import DashboardPage from "./components/DashBoardPage";
import OrdersPage from "./components/OrdersPage";

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
            path: "/orders",
            Component: OrdersPage,
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
