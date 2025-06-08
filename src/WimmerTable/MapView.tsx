import "@maptiler/sdk/dist/maptiler-sdk.css";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import * as maptilersdk from "@maptiler/sdk";
import { useEffect } from "react";

maptilersdk.config.apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

type MapProps = {
  lon: number;
  lat: number;
  opened: boolean;
  updateCoordinates: (lon: number, lat: number) => void;
};

type MapViewProps = {
  lon: number;
  lat: number;
  opened: boolean;
  onClose: () => void;
  updateCoordinates: (lon: number, lat: number) => void;
};

function Map({ lon, lat, opened, updateCoordinates }: MapProps) {
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

  return null;
}

export default function MapView({
  lon,
  lat,
  opened,
  onClose,
  updateCoordinates,
}: MapViewProps) {
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
