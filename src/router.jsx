import { createBrowserRouter } from "react-router-dom";
import WelcomePage from "./WelcomePage";
import ObservationLauncher from "./components/ObservationLauncher";

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />,
  },
  {
    path: "observationlauncher",
    element: <ObservationLauncher />,
  },
]);

export { router };
