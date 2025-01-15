import { Autocomplete, Box, Button, IconButton } from "@mui/material";
import MyLocationIcon from "@mui/icons-material/MyLocation";
import MapIcon from "@mui/icons-material/Map";
import TextField from "@mui/material/TextField";
import MapView from "../../components/MapView";
import HoursSlider from "../../components/HoursSlider";
import FilteredObjectsTable from "../../components/FilteredObjectsTable";
import AngleSlider from "../../components/AngleSlider";
import { useEffect, useState } from "react";
import * as maptilerClient from "@maptiler/client";

export default function DashboardPage() {
  const [apiData, setApiData] = useState({});
  const [placeName, setPlaceName] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [placesList, setPlacesList] = useState([]);
  const [delayActive, setDelayActive] = useState(false);
  const [noOptionsText, setNoOptionsText] = useState("No options");
  const [mapWindowOpened, setMapWindowOpened] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [angle, setAngle] = useState(null);

  maptilerClient.config.apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

  function handleStartTimeUpdate(startTime) {
    setStartTime(startTime);
  }

  function handleEndTimeUpdate(endTime) {
    setEndTime(endTime);
  }

  async function updateCoordinates(lon, lat) {
    setLatitude(lat);
    setLongitude(lon);

    const data = await maptilerClient.geocoding.reverse([lon, lat]);

    setApiData(data);
    setPlaceName(data.features[0].context[1].text);
  }

  async function handleGeolocationButton() {
    if (!("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const browserLat = position.coords.latitude;
        const browserLon = position.coords.longitude;

        updateCoordinates(browserLon, browserLat);
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

  function handleMapButton() {
    setMapWindowOpened(true);
  }

  function handleMapClose() {
    setMapWindowOpened(false);
  }

  function handlePlaceChange(value) {
    const id = placesList.indexOf(value);
    if (apiData.features[id]) {
      setLongitude(apiData.features[id].geometry.coordinates[0]);
      setLatitude(apiData.features[id].geometry.coordinates[1]);
    }
  }

  function handleLatFieldChange(event) {
    setLatitude(Number(event.target.value));
  }

  function handleLonFieldChange(event) {
    setLongitude(Number(event.target.value));
  }

  function handleAngleChange(angle) {
    setAngle(Number(angle));
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
      setNoOptionsText("No options");

      // clear out options list in case any error occur during fetch to not confuse user
      setPlacesList([]);

      try {
        const data = await maptilerClient.geocoding.forward(placeName);

        setApiData(data);
        const places = data.features.map((feature) => {
          return `${feature.place_name}, ${feature.context[2].text}`;
        });
        setPlacesList(places);
      } catch (error) {
        console.log("Error during fetch", error);
        setNoOptionsText("Connection error");
      }

      setDelayActive(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [placeName]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            width: "100%",
            maxWidth: "800px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              maxWidth: 600,
            }}
          >
            <Autocomplete
              onChange={(event, value) => handlePlaceChange(value)}
              fullWidth={true}
              onInputChange={(event, place) => setPlaceName(place)}
              filterOptions={(x) => x} // disable built-in filtering
              options={placesList}
              renderInput={(params) => (
                <TextField {...params} label="Search location" />
              )}
              value={placeName}
              loading={delayActive}
              noOptionsText={noOptionsText}
            />

            <IconButton
              sx={{ width: 40, height: 40, alignSelf: "center" }}
              aria-label="locate me"
              onClick={handleGeolocationButton}
            >
              <MyLocationIcon />
            </IconButton>
          </Box>

          <Button
            sx={{ alignSelf: "center" }}
            variant="outlined"
            aria-label="open map"
            onClick={handleMapButton}
          >
            Select on map
            <MapIcon sx={{ marginLeft: "10px" }} />
          </Button>
        </Box>
        <br />
        <Box sx={{ display: "flex", gap: "10px" }}>
          <TextField
            sx={{ maxWidth: "200px" }}
            id="longitude"
            label={"Longitude"}
            size="small"
            variant="standard"
            value={longitude}
            onChange={(event) => handleLonFieldChange(event)}
            slotProps={{
              inputLabel: {
                shrink: !!longitude || longitude === 0,
              },
            }}
          />
          <TextField
            sx={{ maxWidth: "200px" }}
            id="latitude"
            label={"Latitude"}
            size="small"
            variant="standard"
            value={latitude}
            onChange={(event) => handleLatFieldChange(event)}
            slotProps={{
              inputLabel: {
                shrink: !!latitude || latitude === 0,
              },
            }}
          />
          <br />
        </Box>
        <MapView
          // center map on Wroclaw by default
          lon={longitude === null ? 17.0385 : longitude}
          lat={latitude === null ? 51.1079 : latitude}
          opened={mapWindowOpened}
          onClose={handleMapClose}
          updateCoordinates={updateCoordinates}
        />
        <br />
        <p>Observation hours:</p>
        <HoursSlider
          latitude={latitude}
          longitude={longitude}
          inactive={longitude === null || latitude === null ? true : false}
          handleStartTimeUpdate={handleStartTimeUpdate}
          handleEndTimeUpdate={handleEndTimeUpdate}
        />
        <p>Minimum altitude:</p>
        <AngleSlider
          inactive={longitude === null || latitude === null ? true : false}
          handleAngleChange={handleAngleChange}
        />
        {startTime !== null && endTime !== null && angle !== null && (
          <>
            <FilteredObjectsTable
              latitude={latitude}
              longitude={longitude}
              angle={angle}
              startTime={startTime}
              endTime={endTime}
            />
          </>
        )}
      </Box>
    </>
  );
}
