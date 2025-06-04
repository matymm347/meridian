import MapView from "./MapView";
// import HoursSlider from "./HoursSlider";
// import FilteredObjectsTable from "./FilteredObjectsTable";
// import AngleSlider from "./AngleSlider";
import { useEffect, useState } from "react";
import * as maptilerClient from "@maptiler/client";
import SearchBar from "./SearchBar";
import type { GeocodingSearchResult } from "@maptiler/sdk";
import LocationIcon from "@/components/ui/locationIcon";
import { Button } from "@/components/ui/button";

export default function WimmerTablePage() {
  const [apiData, setApiData] = useState<GeocodingSearchResult | null>(null);
  const [placeName, setPlaceName] = useState<string>("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [placesList, setPlacesList] = useState<string[]>([]);
  const [delayActive, setDelayActive] = useState(false);
  const [noOptionsText, setNoOptionsText] = useState("No options");
  const [mapWindowOpened, setMapWindowOpened] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [angle, setAngle] = useState<number | null>(null);

  maptilerClient.config.apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

  // function handleStartTimeUpdate(startTime: Date) {
  //   setStartTime(startTime);
  // }

  // function handleEndTimeUpdate(endTime: Date) {
  //   setEndTime(endTime);
  // }

  async function updateCoordinates(lon: number, lat: number) {
    setLatitude(lat);
    setLongitude(lon);

    const data: GeocodingSearchResult = await maptilerClient.geocoding.reverse([
      lon,
      lat,
    ]);

    setApiData(data);
    data.features?.[0]?.context?.[1]?.text &&
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

  // function handlePlaceChange(value: string) {
  //   const id = placesList.indexOf(value);
  //   if (apiData?.features[id]) {
  //     const geometry = apiData.features[id].geometry;

  //     if (geometry.type === "Point") {
  //       const [lon, lat] = geometry.coordinates;
  //       setLongitude(lon);
  //       setLatitude(lat);
  //     }
  //   }
  // }

  // function handleLatFieldChange(event) {
  //   setLatitude(Number(event.target.value));
  // }

  // function handleLonFieldChange(event) {
  //   setLongitude(Number(event.target.value));
  // }

  // function handleAngleChange(angle) {
  //   setAngle(Number(angle));
  // }

  return (
    <>
      <SearchBar />
      <Button onClick={handleGeolocationButton}>
        <LocationIcon />
      </Button>
      <MapView
        // center map on Wroclaw by default
        lon={longitude === null ? 17.0385 : longitude}
        lat={latitude === null ? 51.1079 : latitude}
        updateCoordinates={updateCoordinates}
      />
    </>
  );
}
