import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";
import * as Astronomy from "astronomy-engine";

const astroDuskColor = "#21215A";
const nauticalDuskColor = "#273C99";
const civilDuskColor = "#3B54A7";
const dayColor = "#9774B4";

type HoursSliderProps = {
  latitude: number;
  longitude: number;
  handleStartTimeUpdate: (startTime: Date) => void;
  handleEndTimeUpdate: (endTime: Date) => void;
};

export default function HoursSlider({
  latitude,
  longitude,
  handleStartTimeUpdate,
  handleEndTimeUpdate,
}: HoursSliderProps) {
  const [value, setValue] = useState<number | number[]>([500, 1000]);

  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const time = new Date();
  time.setUTCHours(0, 0, 0, 0);
  const lastMidnightTime = Astronomy.MakeTime(time);
  const solarMidnight = Astronomy.SearchHourAngle(
    Astronomy.Body.Sun,
    observer,
    12,
    lastMidnightTime,
    1
  ).time.date;

  let sliderMidnightString = solarMidnight.toString();
  sliderMidnightString = sliderMidnightString.slice(16, 21);
  const sliderMidnight = Number(timeToMinutes(sliderMidnightString));

  const eventTimes = calculateTimeBlocks();

  const railBackgroundStyle = () => {
    const sunEq = Astronomy.Equator(
      Astronomy.Body.Sun,
      time,
      observer,
      false,
      false
    );
    const sunPosition = Astronomy.Horizon(
      time,
      observer,
      sunEq.ra,
      sunEq.dec,
      "normal"
    );

    let railStyle = `linear-gradient(
        to right,
        ${dayColor} 0%,
        ${dayColor} ${50 - eventTimes.civilDusk}%,
        ${civilDuskColor} ${50 - eventTimes.civilDusk}%,
        ${civilDuskColor} ${50 - eventTimes.nauticalDusk}%,
        ${nauticalDuskColor} ${50 - eventTimes.nauticalDusk}%,
        ${nauticalDuskColor} ${50 - eventTimes.astroDusk}%,
        ${astroDuskColor} ${50 - eventTimes.astroDusk}%,
        ${astroDuskColor} ${50 + eventTimes.astroDusk}%,
        ${nauticalDuskColor} ${50 + eventTimes.astroDusk}%,
        ${nauticalDuskColor} ${50 + eventTimes.nauticalDusk}%,
        ${civilDuskColor} ${50 + eventTimes.nauticalDusk}%,
        ${civilDuskColor} ${50 + eventTimes.civilDusk}%,
        ${dayColor} ${50 + eventTimes.civilDusk}%,
        ${dayColor} 100%)`;

    if (eventTimes.civilDusk === 0) {
      railStyle = `linear-gradient(
        to right,
        ${civilDuskColor} 0%,
        ${civilDuskColor} ${50 - eventTimes.nauticalDusk}%,
        ${nauticalDuskColor} ${50 - eventTimes.nauticalDusk}%,
        ${nauticalDuskColor} ${50 - eventTimes.astroDusk}%,
        ${astroDuskColor} ${50 - eventTimes.astroDusk}%,
        ${astroDuskColor} ${50 + eventTimes.astroDusk}%,
        ${nauticalDuskColor} ${50 + eventTimes.astroDusk}%,
        ${nauticalDuskColor} ${50 + eventTimes.nauticalDusk}%,
        ${civilDuskColor} ${50 + eventTimes.nauticalDusk}%,
        ${civilDuskColor} 100%)`;
    }

    if (eventTimes.nauticalDusk === 0 && eventTimes.civilDusk === 0) {
      railStyle = `linear-gradient(
        to right,
        ${nauticalDuskColor} 0%,
        ${nauticalDuskColor} ${50 - eventTimes.astroDusk}%,
        ${astroDuskColor} ${50 - eventTimes.astroDusk}%,
        ${astroDuskColor} ${50 + eventTimes.astroDusk}%,
        ${nauticalDuskColor} ${50 + eventTimes.astroDusk}%,
        ${nauticalDuskColor} 100%)`;
    }

    if (
      eventTimes.astroDusk === 0 &&
      eventTimes.nauticalDusk !== 0 &&
      eventTimes.civilDusk !== 0
    ) {
      railStyle = `linear-gradient(
        to right,
        ${dayColor} 0%,
        ${dayColor} ${50 - eventTimes.civilDusk}%,
        ${civilDuskColor} ${50 - eventTimes.civilDusk}%,
        ${civilDuskColor} ${50 - eventTimes.nauticalDusk}%,
        ${nauticalDuskColor} ${50 - eventTimes.nauticalDusk}%,
        ${nauticalDuskColor} ${50 + eventTimes.nauticalDusk}%,
        ${civilDuskColor} ${50 + eventTimes.nauticalDusk}%,
        ${civilDuskColor} ${50 + eventTimes.civilDusk}%,
        ${dayColor} ${50 + eventTimes.civilDusk}%,
        ${dayColor} 100%)`;
    }

    if (
      eventTimes.astroDusk === 0 &&
      eventTimes.nauticalDusk === 0 &&
      eventTimes.civilDusk !== 0
    ) {
      railStyle = `linear-gradient(
        to right,
        ${dayColor} 0%,
        ${dayColor} ${50 - eventTimes.civilDusk}%,
        ${civilDuskColor} ${50 - eventTimes.civilDusk}%,
        ${civilDuskColor} ${50 - eventTimes.nauticalDusk}%,
        ${civilDuskColor} ${50 + eventTimes.nauticalDusk}%,
        ${civilDuskColor} ${50 + eventTimes.civilDusk}%,
        ${dayColor} ${50 + eventTimes.civilDusk}%,
        ${dayColor} 100%)`;
    }

    // 24h of day or astro night
    if (
      eventTimes.civilDusk === 0 &&
      eventTimes.nauticalDusk === 0 &&
      eventTimes.astroDusk === 0
    ) {
      if (sunPosition.altitude > 0) {
        railStyle = `linear-gradient(
            to right,
            ${dayColor} 0%,
            ${dayColor} 100%)`;
      } else if (sunPosition.altitude < 0) {
        railStyle = `linear-gradient(
            to right,
            ${astroDuskColor} 0%,
            ${astroDuskColor} 100%)`;
      }
    }

    const style = {
      "& .MuiSlider-rail": {
        background: railStyle, // Gradient for rail colors
        opacity: 1, // Ensure the rail is fully opaque
        height: 20,
      },
    };
    return style;
  };

  function calculateTimeBlocks() {
    const civilDusk = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      observer,
      -1,
      lastMidnightTime,
      1,
      -6
    );

    const nauticalDusk = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      observer,
      -1,
      lastMidnightTime,
      1,
      -12
    );

    const astroDusk = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      observer,
      -1,
      lastMidnightTime,
      1,
      -18
    );

    const sunSet = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      observer,
      -1,
      lastMidnightTime,
      1,
      0
    );

    const eventsList = [civilDusk, nauticalDusk, astroDusk, sunSet];
    const eventsDiameters = eventsList.map((event) => {
      if (event === null) {
        return 0;
      }

      if (solarMidnight < event.date) {
        solarMidnight.setDate(solarMidnight.getDate() + 1);
      }
      // comparing date object with astronomy-engine time, thus .date method on it
      const eventLength =
        (solarMidnight.getTime() - event.date.getTime()) / (1000 * 60 * 14.4); // 14.4 to convert to % values
      return eventLength;
    });

    const eventTimes = {
      civilDusk: eventsDiameters[0],
      nauticalDusk: eventsDiameters[1],
      astroDusk: eventsDiameters[2],
      sunSet: eventsDiameters[3],
    };

    return eventTimes;
  }

  const handleChange = (newValue: number | number[]) => {
    setValue(newValue);
  };

  function timeToMinutes(timeStr: string) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  const valueLabelFormat = (value: number) => {
    // center on sliderMidnight
    value = value + 720 + sliderMidnight;
    if (value > 1440) {
      value -= 1440;
    }

    let hours = Math.floor(value / 60);
    let minutes = value % 60;
    let minutesString = "";

    // add leading 0
    if (minutes < 10) {
      minutesString = `0${minutes}`;
    } else {
      minutesString = `${minutes}`;
    }

    // reset counter after midnight
    if (hours > 24) {
      hours -= 25;
    }

    return `${hours}:${minutesString}`;
  };

  const handleChangeCommited = (value: number | number[]) => {
    if (!Array.isArray(value)) {
      return;
    }
    for (let index = 0; index < value.length; index++) {
      let crossingMidnight = false;

      const time = new Date();
      let newValue = value[index] + 720 + sliderMidnight;

      if (newValue > 1440) {
        newValue -= 1440;
        crossingMidnight = true;
      }

      let hours = Math.floor(newValue / 60);
      let minutes = newValue % 60;
      let minutesString = "";
      // add leading 0
      if (minutes < 10) {
        minutesString = `0${minutes}`;
      }

      if (crossingMidnight) {
        time.setDate(time.getDate() + 1);
      }

      time.setHours(hours, Number(minutesString), 0, 0);

      if (index === 0) {
        handleStartTimeUpdate(time);
      } else if (index === 1) {
        handleEndTimeUpdate(time);
      }
    }
  };

  useEffect(() => {
    if (Array.isArray(value) && value.every((x) => typeof x === "number")) {
      handleChangeCommited(value);
    }
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Slider
        getAriaLabel={() => "Observation hours"}
        value={value}
        onChange={(_event, value, _activeThumb) => handleChange(value)}
        onChangeCommitted={(_event, value) => handleChangeCommited(value)}
        valueLabelDisplay={"on"}
        min={0}
        max={1440}
        valueLabelFormat={valueLabelFormat}
        sx={railBackgroundStyle}
      />
      <Box
        id="hours-slider-legend"
        sx={{ display: "flex", justifyContent: "center" }}
      >
        <Box sx={{ alignSelf: "center", display: "flex", margin: "10px" }}>
          <div
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              backgroundColor: astroDuskColor,
              alignSelf: "center",
              margin: "5px",
            }}
          ></div>
          <p style={{ color: "#999", fontSize: "10px" }}>Astro Dark</p>
        </Box>
        <Box sx={{ alignSelf: "center", display: "flex", margin: "10px" }}>
          <div
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              backgroundColor: nauticalDuskColor,
              alignSelf: "center",
              margin: "5px",
            }}
          ></div>
          <p style={{ color: "#999", fontSize: "10px" }}>Nautical Dark</p>
        </Box>
        <Box sx={{ alignSelf: "center", display: "flex", margin: "10px" }}>
          <div
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              backgroundColor: civilDuskColor,
              alignSelf: "center",
              margin: "5px",
            }}
          ></div>
          <p style={{ color: "#999", fontSize: "10px" }}>Civil Dark</p>
        </Box>
        <Box sx={{ alignSelf: "center", display: "flex", margin: "10px" }}>
          <div
            style={{
              width: "15px",
              height: "15px",
              borderRadius: "50%",
              backgroundColor: dayColor,
              alignSelf: "center",
              margin: "5px",
            }}
          ></div>
          <p style={{ color: "#999", fontSize: "10px" }}>Day</p>
        </Box>
      </Box>
    </Box>
  );
}
