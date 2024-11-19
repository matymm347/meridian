import { Autocomplete, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import HoursSlider from "../../components/HoursSlider";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [placeName, setPlaceName] = useState("");
  const [placesList, setPlacesList] = useState([]);
  const [delayActive, setDelayActive] = useState(false);

  useEffect(() => {
    if (placeName === "") {
      setPlacesList([]);
      return;
    }

    const timer = setTimeout(() => {
      if (delayActive === false) {
        setDelayActive(true);
        fetch(`http://localhost:3000/geocode?placename=${placeName}`).then(
          (response) =>
            response.json().then((data) => {
              let places = data.features.map((feature) => {
                return feature.place_name;
              });
              setPlacesList(places);
            })
        );
        setDelayActive(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [placeName]);

  return (
    <>
      <Box>
        <p>Your location:</p>
        <Autocomplete
          onInputChange={(event, place) => setPlaceName(place)}
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
