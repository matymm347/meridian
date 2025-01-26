import { useTheme } from "@emotion/react";
import Box from "@mui/material/Box";

export default function ObjectVisibilityLine({
  startTime,
  endTime,
  observationStart,
  observationEnd,
}) {
  const totalTime = endTime - startTime;
  const totalObservationTime = observationEnd - observationStart;
  const observationStartOffset =
    (100 * (observationStart - startTime)) / totalTime;
  const observationLineLength = (100 * totalObservationTime) / totalTime;

  const theme = useTheme();

  const backgroundColor = "#343452";

  const style = `linear-gradient(
          to right,
          ${backgroundColor} 0%,
          ${backgroundColor} ${observationStartOffset}%,
          ${theme.palette.primary.main} ${observationStartOffset}%,
          ${theme.palette.primary.main} ${observationStartOffset + observationLineLength}%,
          ${backgroundColor} ${observationStartOffset + observationLineLength}%,
          ${backgroundColor} 100%)`;

  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "10px",
          position: "relative",
          background: style,
          borderRadius: "10px",
        }}
      ></Box>
    </>
  );
}
