import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import WelcomePage from "./WelcomePage";
import ObservationLauncher from "./components/ObservationLauncher";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* <WelcomePage /> */}
    <ObservationLauncher />
  </StrictMode>
);
