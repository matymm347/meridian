import { Autocomplete, Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import HoursSlider from "../../components/HoursSlider";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [apiData, setApiData] = useState({});
  const [placeName, setPlaceName] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [longitude, setLongitude] = useState("Longitude");
  const [latitude, setLatitude] = useState("Latitude");
  const [placesList, setPlacesList] = useState([]);
  const [delayActive, setDelayActive] = useState(false);

  function handlePlaceChange(value) {
    const id = placesList.indexOf(value);
    setSelectedPlaceId(id);
    setLongitude(apiData.features[id].geometry.coordinates[0]);
    setLatitude(apiData.features[id].geometry.coordinates[1]);
  }

  function convertLonLat(value) {
    if (typeof value !== "string") {
      return parseFloat(value).toFixed(4);
    } else if (typeof value === "string") {
      return value;
    }
  }

  useEffect(() => {
    if (delayActive === true) {
      return;
    }

    if (placeName.length < 4) {
      setPlacesList([]);
      return;
    }

    const timer = setTimeout(async () => {
      setDelayActive(true);
      const response = await fetch(
        `http://localhost:3000/geocode?placename=${placeName}`
      );

      const data = await response.json();
      setApiData(data);
      const places = data.features.map((feature) => {
        return `${feature.place_name}, ${feature.context[2].text}`;
      });
      setPlacesList(places);

      setDelayActive(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [placeName]);

  return (
    <>
      <Box>
        <p>Your location:</p>
        <Autocomplete
          onChange={(event, value) => handlePlaceChange(value)}
          onInputChange={(event, place) => setPlaceName(place)}
          sx={{ width: 600 }}
          filterOptions={(x) => x} // disable built-in filtering
          disablePortal
          options={placesList}
          renderInput={(params) => <TextField {...params} label="Location" />}
        />
        <br />
        <TextField
          id="longitude"
          label={convertLonLat(longitude)}
          variant="filled"
        />
        <TextField
          id="latitude"
          label={convertLonLat(latitude)}
          variant="filled"
        />

        <p>Observation hours:</p>
        <HoursSlider />
      </Box>
    </>
  );
}
