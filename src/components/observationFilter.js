import * as Astronomy from "astronomy-engine";

export default function observationFilter(
  nr,
  latitude,
  longitude,
  angle,
  startTime,
  endTime,
  ra,
  dec
) {
  const startTimeAstro = Astronomy.MakeTime(startTime);
  const endTimeAstro = Astronomy.MakeTime(endTime);
  const observer = new Astronomy.Observer(latitude, longitude, 0);

  let dateForLastMidnight = new Date(startTime);
  dateForLastMidnight.setUTCHours(0);
  const lastMidnightTime = Astronomy.MakeTime(dateForLastMidnight);

  Astronomy.DefineStar("Star1", ra, dec, 1000);

  const startAz = Astronomy.Horizon(
    startTimeAstro,
    observer,
    ra,
    dec,
    "normal"
  );

  const endAz = Astronomy.Horizon(endTimeAstro, observer, ra, dec, "normal");

  const topAz = Astronomy.SearchHourAngle(
    "Star1",
    observer,
    0,
    lastMidnightTime,
    1
  );

  const atTargetAngleAscend = Astronomy.SearchAltitude(
    "Star1",
    observer,
    1,
    lastMidnightTime,
    1,
    angle
  );

  let atTargetAngleDescend = Astronomy.SearchAltitude(
    "Star1",
    observer,
    -1,
    lastMidnightTime,
    1,
    angle
  );

  if (atTargetAngleDescend < atTargetAngleAscend) {
    atTargetAngleDescend = Astronomy.SearchAltitude(
      "Star1",
      observer,
      -1,
      atTargetAngleAscend,
      1,
      angle
    );
  }

  const objectData = {
    available: false,
    observationStart: null,
    observationEnd: null,
  };

  // Object never cross target angle and never goes above it
  if (
    atTargetAngleAscend === null &&
    atTargetAngleDescend === null &&
    startAz.altitude < angle
  ) {
    return objectData;
  }

  // Object never cross target angle and is always above it
  if (
    atTargetAngleAscend === null &&
    atTargetAngleDescend === null &&
    startAz.altitude >= angle
  ) {
    objectData.available = true;
    objectData.observationStart = startTime;
    objectData.observationEnd = endTime;

    return objectData;
  }

  // Test if star trail is within observation hours
  if (
    (atTargetAngleAscend < startTimeAstro &&
      atTargetAngleDescend < startTimeAstro) ||
    (atTargetAngleAscend > endTimeAstro && atTargetAngleDescend > endTimeAstro)
  ) {
    return objectData;
  }

  // Additional test for returned null value when star is always below given angle
  if (atTargetAngleAscend === null || atTargetAngleDescend === null) {
    return objectData;
  }

  objectData.available = true;

  // Return available observation hours
  if (atTargetAngleAscend < startTimeAstro) {
    objectData.observationStart = startTimeAstro.date;
  } else {
    objectData.observationStart = atTargetAngleAscend.date;
  }

  if (atTargetAngleDescend > endTimeAstro) {
    objectData.observationEnd = endTimeAstro.date;
  } else {
    objectData.observationEnd = atTargetAngleDescend.date;
  }

  return objectData;
}
