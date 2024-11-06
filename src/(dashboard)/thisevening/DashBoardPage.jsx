import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import HoursSlider from "../../components/HoursSlider";

export default function DashboardPage() {
  return (
    <>
      <Box>
        <p>Your location:</p>
        <TextField id="location-name" label="Location name" variant="filled" />
        <TextField id="longitude" label="Longitude" variant="filled" />
        <TextField id="latitude" label="Latitude" variant="filled" />

        <p>Observation hours:</p>
        <HoursSlider />
      </Box>
    </>
  );
}
