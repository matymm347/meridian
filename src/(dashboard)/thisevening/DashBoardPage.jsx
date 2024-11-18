import { Autocomplete, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import HoursSlider from "../../components/HoursSlider";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [placeName, setPlaceName] = useState("");
  const [placesList, setPlacesList] = useState([]);

  useEffect(() => {
    if (placeName === "") {
      setPlacesList([]);
      return;
    }

    setTimeout(() => {
      fetch(`http://localhost:3000/geocode?placename=${placeName}`).then(
        (response) => response.json()
      ); // some function to set placesList here
    }, 500);
  });

  return (
    <>
      <Box>
        <p>Your location:</p>
        <Autocomplete
          sx={{ width: 300 }}
          filterOptions={(x) => x} // disable built-in filtering
          disablePortal
          options={placesList}
          renderInput={(params) => <TextField {...params} label="Location" />}
        />
        <br />
        <TextField id="longitude" label="Longitude" variant="filled" />
        <TextField id="latitude" label="Latitude" variant="filled" />

        <p>Observation hours:</p>
        <HoursSlider />
      </Box>
    </>
  );
}
