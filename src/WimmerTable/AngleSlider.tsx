import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";

const defaultAngle = [30];
const sliderLabel = "Minimum altitude angle";
const sliderWidth = "50%";

export default function AngleSlider({ inactive, handleAngleChange }) {
  const [value, setValue] = useState(defaultAngle);
  const [atDefaultState, setAtDefaultState] = useState(true);

  const handleChangeCommited = (event, value) => {
    setAtDefaultState(false);
    handleAngleChange(value);
  };

  function valueLabelFormat(value) {
    return value + "°";
  }

  function handleChange(event, newValue) {
    setValue(newValue);
  }

  useEffect(() => {
    handleChangeCommited(null, value);
  }, []);

  return (
    <>
      {inactive ? (
        <Box sx={{ width: sliderWidth }}>
          <Slider
            disabled={true}
            getAriaLabel={() => sliderLabel}
            value={value}
            valueLabelDisplay={"off"}
          />
        </Box>
      ) : (
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
      )}
    </>
  );
}
