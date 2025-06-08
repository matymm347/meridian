import Box from "@mui/material/Box";
import Slider from "@mui/material/Slider";
import { useEffect, useState } from "react";

const defaultAngle = [30];
const sliderLabel = "Minimum altitude angle";
const sliderWidth = "50%";

type AngleSliderProps = {
  inactive: boolean;
  handleAngleChange: (angle: number) => void;
};

export default function AngleSlider({
  inactive,
  handleAngleChange,
}: AngleSliderProps) {
  const [value, setValue] = useState<number[]>(defaultAngle);

  const handleChangeCommited = (value: number | number[]) => {
    if (Array.isArray(value)) {
      handleAngleChange(value[0]);
    }
  };

  function valueLabelFormat(value: number) {
    return value + "°";
  }

  function handleChange(newValue: number | number[]) {
    if (Array.isArray(newValue)) {
      setValue(newValue);
    }
  }

  useEffect(() => {
    handleChangeCommited(value);
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
            onChange={(_event, value) => handleChange(value)}
            onChangeCommitted={(_event, value) => handleChangeCommited(value)}
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
