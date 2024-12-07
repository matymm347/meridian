import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import {
  SearchAltitude,
  SearchHourAngle,
  Body,
  Observer,
  MakeTime,
} from "astronomy-engine";
import { Dashboard } from "@mui/icons-material";

export default function HoursSlider({ latitude, longitude, height, inactive }) {
  const [value, setValue] = useState([500, 1000]);

  const observer = new Observer(latitude, longitude, 0);
  const time = new Date();
  time.setUTCHours(0, 0, 0, 0);
  const lastMidnightTime = MakeTime(time);
  let solarMidnight = SearchHourAngle(
    Body.Sun,
    observer,
    12,
    lastMidnightTime,
    1
  ).time.date;
  solarMidnight = solarMidnight.toString();
  solarMidnight = solarMidnight.slice(16, 21);
  solarMidnight = timeToMinutes(solarMidnight);

  const eventTimes = calculateTimeBlocks(latitude, longitude, height);

  const activeStyle = {
    "& .MuiSlider-rail": {
      background: `radial-gradient(
      circle, 
        navy 0%,
        navy ${eventTimes.astroDusk / 14.4}%,
        blue ${eventTimes.astroDusk / 14.4}%,
        blue ${eventTimes.nauticalDusk / 14.4}%,
        azure ${eventTimes.nauticalDusk / 14.4}%,
        azure ${eventTimes.civilDusk / 14.4}%,
        cadetblue ${eventTimes.civilDusk / 14.4}%,
        cadetblue 100%
      )`, // Gradient for rail colors
      opacity: 1, // Ensure the rail is fully opaque
      height: 20,
    },
  };

  const inactiveStyle = {
    "& .MuiSlider-rail": {
      background: "grey",
      opacity: 1, // Ensure the rail is fully opaque
      height: 20,
    },
  };

  function calculateTimeBlocks(latitude, longitude) {
    const civilDusk = SearchAltitude(
      Body.Sun,
      observer,
      -1,
      lastMidnightTime,
      1,
      -6
    ).date;

    const nauticalDusk = SearchAltitude(
      Body.Sun,
      observer,
      -1,
      lastMidnightTime,
      1,
      -12
    ).date;

    const astroDusk = SearchAltitude(
      Body.Sun,
      observer,
      -1,
      lastMidnightTime,
      1,
      -18
    ).date;

    const eventsList = [civilDusk, nauticalDusk, astroDusk];
    const eventsDiameters = eventsList.map((event) => {
      const dateString = event.toString();
      const hourString = timeToMinutes(dateString.slice(16, 21));
      // HoursSlider need diameter which is twice the radius
      const eventLength = (solarMidnight - hourString) * 2;
      return eventLength;
    });

    const eventTimes = {
      civilDusk: eventsDiameters[0],
      nauticalDusk: eventsDiameters[1],
      astroDusk: eventsDiameters[2],
    };

    return eventTimes;
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  }

  const valueLabelFormat = (value) => {
    // center on solarMidnight
    value = value + 720 + solarMidnight;
    if (value > 1440) {
      value -= 1440;
    }

    let hours = Math.floor(value / 60);
    let minutes = value % 60;
    // add leading 0
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    // reset counter after midnight
    if (hours > 24) {
      hours -= 25;
    }

    return `${hours}:${minutes}`;
  };

  return (
    <>
      <Box sx={{ width: 600 }}>
        <Slider
          disabled={inactive}
          getAriaLabel={() => "Observation hours"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay={inactive === false ? "on" : "off"}
          min={0}
          max={1440}
          valueLabelFormat={valueLabelFormat}
          sx={inactive === false ? activeStyle : inactiveStyle}
        />
      </Box>
    </>
  );
}

HoursSlider.propTypes = {
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
