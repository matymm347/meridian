import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilersdk from "@maptiler/sdk";
import { useEffect } from "react";

maptilersdk.config.apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

export default function MapView({ lon, lat }) {
  useEffect(() => {
    const map = new maptilersdk.Map({
      container: "map-view",
      style: maptilersdk.MapStyle.STREETS,
      center: [lon, lat],
      zoom: 14,
    });

    return () => map.remove();
  }, [lon, lat]);

  return (
    <>
      <div
        id="map-view"
        style={{ position: "absolute", top: 0, bottom: 0, width: "100%" }}
      ></div>
    </>
  );
}
