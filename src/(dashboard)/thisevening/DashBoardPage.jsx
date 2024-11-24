import { Autocomplete, Box, IconButton } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import TextField from "@mui/material/TextField";
import HoursSlider from "../../components/HoursSlider";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [apiData, setApiData] = useState({});
  const [placeName, setPlaceName] = useState("");
  const [selectedPlaceId, setSelectedPlaceId] = useState(null);
  const [latitude, setLatitude] = useState("Latitude");
  const [longitude, setLongitude] = useState("Longitude");
  const [placesList, setPlacesList] = useState([]);
  const [delayActive, setDelayActive] = useState(false);

  async function handleGeolocationButton() {
    if (!("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const browserLat = position.coords.latitude;
        const browserLon = position.coords.longitude;

        setLatitude(browserLat);
        setLongitude(browserLon);

        const response = await fetch(
          `http://localhost:3000/revgeocode?lat=${browserLat}&lon=${browserLon}`
        );
        const data = await response.json();

        setApiData(data);
        setPlaceName(data.features[0].context[1].text);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            console.error("User denied the request for Geolocation.");
            break;
          case error.POSITION_UNAVAILABLE:
            console.error("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            console.error("The request to get user location timed out.");
            break;
          default:
            console.error("An unknown error occurred.");
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }

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

    // if (UseBrowserLocation === true) {
    //   return;
    // }

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
        <Box sx={{ display: "flex" }}>
          <Autocomplete
            onChange={(event, value) => handlePlaceChange(value)}
            onInputChange={(event, place) => setPlaceName(place)}
            sx={{ width: 600 }}
            filterOptions={(x) => x} // disable built-in filtering
            disablePortal
            options={placesList}
            renderInput={(params) => <TextField {...params} label="Location" />}
            value={placeName}
          />

          <IconButton
            sx={{ width: 40, height: 40, alignSelf: "center" }}
            aria-label="locate me"
            onClick={handleGeolocationButton}
          >
            <MyLocationIcon />
          </IconButton>
        </Box>

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
