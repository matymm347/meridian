import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilersdk from "@maptiler/sdk";
import { useEffect, useRef } from "react";

maptilersdk.config.apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

function Map({ lon, lat, opened, updateCoordinates }) {
  useEffect(() => {
    if (!opened) return;

    const map = new maptilersdk.Map({
      container: "map-view",
      style: maptilersdk.MapStyle.BASIC,
      center: [lon, lat],
      zoom: 10,
    });

    let marker = new maptilersdk.Marker().setLngLat([lon, lat]).addTo(map);

    map.on("click", (e) => {
      marker.setLngLat(e.lngLat);
      updateCoordinates(e.lngLat.lng, e.lngLat.lat);
    });
  }, []);
}

export default function MapView({
  lon,
  lat,
  opened,
  onClose,
  updateCoordinates,
}) {
  return (
    <>
      <Dialog open={opened} onClose={onClose} maxWidth={false}>
        <DialogTitle>Select point on map</DialogTitle>
        <div
          style={{
            position: "relative",
            height: "80vh",
            width: "80vw",
            maxWidth: "1000px",
            maxHeight: "750px",
          }}
        >
          <div
            id="map-view"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              width: "100%",
              height: "100%",
            }}
          ></div>
        </div>
        <Map
          lon={lon}
          lat={lat}
          opened={opened}
          updateCoordinates={updateCoordinates}
        />
      </Dialog>
    </>
  );
}
