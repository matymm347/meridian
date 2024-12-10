import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import * as Astronomy from "astronomy-engine";
import wimmerTable from "./wimmerTable";

let startTimeTemp = new Date();
startTimeTemp.setUTCHours(18, 0, 0, 0);
let endTimeTemp = new Date();
endTimeTemp.setUTCHours(22, 0, 0, 0);

export default function ObjectList({
  latitude = 51.14,
  longitude = 17.03,
  angle = 30,
  startTime = startTimeTemp,
  endTime = endTimeTemp,
}) {
  const startTimeAstro = Astronomy.MakeTime(startTime);
  const endTimeAstro = Astronomy.MakeTime(endTime);
  const observer = new Astronomy.Observer(latitude, longitude, 0);

  let dateForLastMidnight = new Date(startTime);
  dateForLastMidnight.setUTCHours(0);
  const lastMidnightTime = Astronomy.MakeTime(dateForLastMidnight);

  const AndromedaGalaxy = Astronomy.DefineStar(
    "Star1",
    wimmerTable[0].ra_number,
    wimmerTable[0].dec_number,
    1000
  );

  const andromedaStartAz = Astronomy.Horizon(
    startTimeAstro,
    observer,
    wimmerTable[0].ra_number,
    wimmerTable[0].dec_number,
    "normal"
  );

  const andromedaEndAz = Astronomy.Horizon(
    endTimeAstro,
    observer,
    wimmerTable[0].ra_number,
    wimmerTable[0].dec_number,
    "normal"
  );

  const andromedaTopHeightAz = Astronomy.SearchHourAngle(
    "Star1",
    observer,
    0,
    lastMidnightTime,
    1
  );

  console.log(andromedaTopHeightAz);

  return (
    <>
      <div>
        Andromeda start altitude: {andromedaStartAz.altitude} at{" "}
        {startTime.getHours()}
        <br />
        Top az will be {andromedaTopHeightAz.time.toString()}
      </div>
    </>
  );
}
