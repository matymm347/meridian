import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useState } from "react";

const defaultAngle = [30];
const sliderLabel = "Minimum altitude angle";
const sliderWidth = "50%";

export default function AngleSlider({ inactive, handleAngleChange }) {
  const [value, setValue] = useState(defaultAngle);

  if (inactive) {
    return (
      <>
        <Box sx={{ width: sliderWidth }}>
          <Slider
            disabled={true}
            getAriaLabel={() => sliderLabel}
            value={value}
            valueLabelDisplay={"off"}
          />
        </Box>
      </>
    );
  }

  const handleChangeCommited = (event, value) => {
    handleAngleChange(value);
  };

  function valueLabelFormat(value) {
    return value + "°";
  }

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  return (
    <>
      <Box sx={{ width: sliderWidth }}>
        <Slider
          getAriaLabel={() => sliderLabel}
          value={value}
          onChange={handleChange}
          onChangeCommitted={handleChangeCommited}
          valueLabelDisplay={"on"}
          min={0}
          max={90}
          valueLabelFormat={valueLabelFormat}
        />
      </Box>
    </>
  );
}
