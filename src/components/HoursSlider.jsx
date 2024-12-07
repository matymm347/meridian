import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useState } from "react";
import { Astronomy } from "astronomy-engine";

export default function HoursSlider({ latitude, longitude, height }) {
  const [value, setValue] = useState([500, 1000]);

  function calculateTimeBlocks(latitude, longitude, height) {
    const observer = new Astronomy.Observer(latitude, longitude, 0);
    const time = new Date();
    time.setUTCHours(0, 0, 0, 0);
    const lastMidnightTime = Astronomy.MakeTime(time);

    const civilDusk = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      observer,
      -1,
      lastMidnightTime,
      1,
      -6
    ).date;

    const nauticalDusk = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      observer,
      -1,
      lastMidnightTime,
      1,
      -12
    ).date;

    const astroDusk = Astronomy.SearchAltitude(
      Astronomy.Body.Sun,
      observer,
      -1,
      lastMidnightTime,
      1,
      -18
    ).date;

    const solarMidnight = Astronomy.SearchHourAngle(
      Astronomy.Body.Sun,
      observer,
      12,
      lastMidnightTime,
      1
    ).time.date;

    const eventsList = [civilDusk, nauticalDusk, astroDusk, solarMidnight];
    const eventsHours = eventsList.map((event) => {
      const dateString = event.toString();
      return dateString.slice(16, 24);
    });

    const eventTimes = {
      civilDusk: eventsList[0],
      nauticalDusk: eventsList[1],
      astroDusk: eventsList[2],
      solarMidnight: eventsList[3],
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
    // center on astroMidnight
    value = value + 720 + timeToMinutes(astroMidnight);
    if (value > 1440) {
      value -= 1440;
    }

    const hours = Math.floor(value / 60);
    let minutes = value % 60;
    // add leading 0
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    return `${hours}:${minutes}`;
  };

  const eventTimes = calculateTimeBlocks(latitude, longitude, height);

  return (
    <>
      <Box sx={{ width: 600 }}>
        <Slider
          getAriaLabel={() => "Observation hours"}
          value={value}
          onChange={handleChange}
          valueLabelDisplay="on"
          min={0}
          max={1440}
          valueLabelFormat={valueLabelFormat}
          sx={{
            "& .MuiSlider-rail": {
              background: `radial-gradient(
              circle, 
                navy 0%,
                navy ${timeToMinutes(astroDarkLength) / 14.4}%,
                blue ${timeToMinutes(astroDarkLength) / 14.4}%,
                blue ${timeToMinutes(nauticalDarkLength) / 14.4}%,
                azure ${timeToMinutes(nauticalDarkLength) / 14.4}%,
                azure ${timeToMinutes(civilDarkLength) / 14.4}%,
                cadetblue ${timeToMinutes(civilDarkLength) / 14.4}%,
                cadetblue 100%
              )`, // Gradient for rail colors
              opacity: 1, // Ensure the rail is fully opaque
              height: 20,
            },
          }}
        />
      </Box>
    </>
  );
}

HoursSlider.propTypes = {
  astroMidnight: PropTypes.string,
  astroDarkLength: PropTypes.string,
  nauticalDarkLength: PropTypes.string,
  civilDarkLength: PropTypes.string,
};
