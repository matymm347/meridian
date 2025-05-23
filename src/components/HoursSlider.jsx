import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";
import * as Astronomy from "astronomy-engine";

const astroDuskColor = "#21215A";
const nauticalDuskColor = "#273C99";
const civilDuskColor = "#3B54A7";
const dayColor = "#9774B4";

export default function HoursSlider({
  latitude,
  longitude,
  height,
  handleStartTimeUpdate,
  handleEndTimeUpdate,
}) {
  const [value, setValue] = useState([500, 1000]);
  const [atDefaultState, setAtDefaultState] = useState(true);

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

  const railBackgroundStyle = () => {
    const sunEq = Astronomy.Equator("Sun", time, observer, false, false);
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
    setAtDefaultState(false);
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
      // add leading 0
      if (minutes < 10) {
        minutes = `0${minutes}`;
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

  useEffect(() => {
    handleChangeCommited(null, value);
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <Slider
        getAriaLabel={() => "Observation hours"}
        value={value}
        onChange={handleChange}
        onChangeCommitted={handleChangeCommited}
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

HoursSlider.propTypes = {
  latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
