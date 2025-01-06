import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";
import * as Astronomy from "astronomy-engine";

export default function HoursSlider({
  latitude,
  longitude,
  height,
  inactive,
  handleStartTimeUpdate,
  handleEndTimeUpdate,
}) {
  const [value, setValue] = useState([500, 1000]);

  if (inactive) {
    return (
      <>
        <Box sx={{ width: 600 }}>
          <Slider
            disabled={true}
            getAriaLabel={() => "Observation hours"}
            value={value}
            valueLabelDisplay={"off"}
            min={0}
            max={1440}
            sx={{
              "& .MuiSlider-rail": {
                background: "grey",
                opacity: 1, // Ensure the rail is fully opaque
                height: 20,
              },
            }}
          />
        </Box>
      </>
    );
  }

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
  let sliderMidnight = solarMidnight.toString();
  sliderMidnight = sliderMidnight.slice(16, 21);
  sliderMidnight = timeToMinutes(sliderMidnight);

  const eventTimes = calculateTimeBlocks();

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

  function calculateTimeBlocks() {
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

    const eventsList = [civilDusk, nauticalDusk, astroDusk];
    const eventsDiameters = eventsList.map((event) => {
      const eventLength =
        ((solarMidnight.getTime() - event.getTime()) * 2) / (1000 * 60);
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

  const valueLabelFormat = (value, index) => {
    // center on sliderMidnight
    value = value + 720 + sliderMidnight;
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

  const handleChangeCommited = (event, value) => {
    for (let index = 0; index < value.length; index++) {
      const time = new Date();
      let newValue = value[index] + 720 + sliderMidnight;
      if (newValue > 1440) {
        newValue -= 1440;
      }

      let hours = Math.floor(newValue / 60);
      let minutes = newValue % 60;
      // add leading 0
      if (minutes < 10) {
        minutes = `0${minutes}`;
      }

      // reset counter after midnight
      let crossingMidnight = false;

      if (hours > 24) {
        hours -= 25;
        crossingMidnight = true;
      }

      if (crossingMidnight) {
        time.setDate(time.getDate() + 1);
      }

      time.setHours(hours, minutes, 0, 0);

      if (index === 0) {
        handleStartTimeUpdate(time);
      } else if (index === 1) {
        handleEndTimeUpdate(time);
      }
    }
  };

  return (
    <>
      <Box sx={{ width: 600 }}>
        <Slider
          disabled={inactive}
          getAriaLabel={() => "Observation hours"}
          value={value}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommited}
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
