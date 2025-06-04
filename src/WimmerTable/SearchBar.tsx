import { useEffect, useState } from "react";
import * as maptilerClient from "@maptiler/client";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function SearchBar() {
  const [placeName, setPlaceName] = useState<string>("");
  const [chosenPlaceName, setChosenPlaceName] = useState<string>("");
  const [placesList, setPlacesList] = useState<string[]>([]);
  const [delayActive, setDelayActive] = useState(false);
  const [noOptionsText, setNoOptionsText] = useState("No options");
  const [open, setOpen] = useState<boolean>(false);

  maptilerClient.config.apiKey = import.meta.env.VITE_MAP_TILER_API_KEY;

  useEffect(() => {
    if (delayActive === true) {
      return;
    }

    if (placeName.length < 4) {
      setPlacesList([]);
      return;
    }

    // Delay after user input to limit API calls
    const timer = setTimeout(async () => {
      setDelayActive(true);
      setNoOptionsText("No options");

      // clear out options list in case any error occur during fetch to not confuse user
      setPlacesList([]);

      try {
        const data = await maptilerClient.geocoding.forward(placeName);

        const places = data.features.map((feature) => {
          if (feature?.context?.[2].text) {
            return feature.place_name;
          }
        });
        // Flter undefined values
        setPlacesList(places.filter((p): p is string => p !== undefined));
      } catch (error) {
        console.log("Error during fetch", error);
        setNoOptionsText("Connection error");
      }

      setDelayActive(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [placeName]);

  function handleInputChange(value: string) {
    setPlaceName(value);
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[400px] justify-between"
          >
            {chosenPlaceName === "" ? "Search location..." : chosenPlaceName}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[400px] p-0">
          <Command>
            <CommandInput
              placeholder="Search location..."
              onValueChange={handleInputChange}
            />
            <CommandList>
              <CommandEmpty>{noOptionsText}</CommandEmpty>
              {placesList.map((place) => {
                return (
                  <CommandItem
                    className="max-w-[400px]"
                    onSelect={(value) => {
                      setChosenPlaceName(value);
                      setOpen(false);
                    }}
                  >
                    {place}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  );
}
