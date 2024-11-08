import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useState } from "react";

export default function HoursSlider({
  astroMidnight = "01:15",
  astroDarkLength = "02:30",
  nauticalDarkLength = "08:15",
  civilDarkLength = "12:20",
}) {
  const [value, setValue] = useState([500, 1000]);

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
