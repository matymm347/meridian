import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilersdk from "@maptiler/sdk";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import MapIcon from "@/components/ui/mapicon";

maptilersdk.config.apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

type MapProps = {
  lon: number;
  lat: number;
  updateCoordinates: (lon: number, lat: number) => void;
};

type MapViewProps = {
  lon: number;
  lat: number;
  updateCoordinates: (lon: number, lat: number) => void;
};

function Map({ lon, lat, updateCoordinates }: MapProps) {
  useEffect(() => {
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

export default function MapView({ lon, lat, updateCoordinates }: MapViewProps) {
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">
            Select on map <MapIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select point on map</DialogTitle>
          </DialogHeader>
          <div id="map-view" className="min-h-[400px]">
            <Map lon={lon} lat={lat} updateCoordinates={updateCoordinates} />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit">Save</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
