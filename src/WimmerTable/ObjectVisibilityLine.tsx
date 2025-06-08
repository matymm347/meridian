import Box from "@mui/material/Box";

type ObjectVisibilityLineProps = {
  startTime: Date;
  endTime: Date;
  observationStart: Date;
  observationEnd: Date;
};

export default function ObjectVisibilityLine({
  startTime,
  endTime,
  observationStart,
  observationEnd,
}: ObjectVisibilityLineProps) {
  const totalTime = endTime.getTime() - startTime.getTime();
  const totalObservationTime =
    observationEnd.getTime() - observationStart.getTime();
  const observationStartOffset =
    (100 * (observationStart.getTime() - startTime.getTime())) / totalTime;
  const observationLineLength = (100 * totalObservationTime) / totalTime;

  const backgroundColor = "#343452";

  const style = `linear-gradient(
          to right,
          ${backgroundColor} 0%,
          ${backgroundColor} ${observationStartOffset}%,
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
