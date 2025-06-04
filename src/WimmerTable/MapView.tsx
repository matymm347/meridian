import "@maptiler/sdk/dist/maptiler-sdk.css";
import * as maptilersdk from "@maptiler/sdk";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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

export default function MapView({ lon, lat, updateCoordinates }: MapViewProps) {
  const [opened, setOpened] = useState<boolean>(false);

  function handleButtonClick() {
    opened ? setOpened(false) : setOpened(true);
  }

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" onClick={handleButtonClick}>
            Open Dialog
          </Button>
        </DialogTrigger>
        <DialogContent className="h-[80vh] w-[80vw] max-w-[1000px] max-h-[750px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div>
            <div
              id="map-view"
              className="absolute top-0 bottom-0 w-full h-full"
            ></div>
          </div>
          <Map
            lon={lon}
            lat={lat}
            opened={opened}
            updateCoordinates={updateCoordinates}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" onClick={handleButtonClick}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleButtonClick}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
