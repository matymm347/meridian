import Box from "@mui/material/Box";
import { TableContainer } from "@mui/material";
import { Table } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableCell } from "@mui/material";
import { TableBody } from "@mui/material";
import wimmerTable from "./wimmerTable";
import observationFilter from "./observationFilter";
import Checkbox from "@mui/material/Checkbox";
import ObjectVisibilityLine from "./ObjectVisibilityLine";

function returnObjectName(row) {
  const catalogPrefixes = [
    { key: "messier", prefix: "M" },
    { key: "ngc", prefix: "NGC " },
    { key: "mel", prefix: "Mel " },
    { key: "ic", prefix: "IC " },
  ];

  const result = catalogPrefixes.find(({ key }) => row[key] !== null);
  if (result) {
    return `${result.prefix}${row[result.key]}`;
  } else {
    return "";
  }
}

function returnObjectType(row) {
  const style = {
    borderRadius: "15%",
    display: "inline-block",
    padding: "2px 13px",
    fontWeight: "bold",
  };

  const objectTypePrefixes = [
    { key: "galaxy", prefix: "Galaxy" },
    { key: "open_cluster", prefix: "Open Cluster" },
    { key: "globular_cluster", prefix: "Globular Cluster" },
    { key: "double_star", prefix: "Double Star" },
    { key: "nebula", prefix: "Nebula" },
    { key: "diffuse_nebulae", prefix: "Diffuse Nebulae" },
    { key: "emmision_nebulae", prefix: "Emmision Nebulae" },
    { key: "reflection_nebulae", prefix: "Reflection Nebulae" },
    { key: "planetary_nebulae", prefix: "Planetary Nebulae" },
  ];

  const objectType = objectTypePrefixes.find(({ key }) => row[key] !== false);
  if (objectType) {
    return <div style={style}>{objectType.prefix}</div>;
  } else {
    return "";
  }
}

function returnDifficulty(row) {
  const style = {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    margin: "auto",
  };

  const easyColor = "#4CAF50";
  const mediumColor = "#FFA726";
  const hardColor = "#FF6B6B";

  if (row.difficulty === 1) {
    style.backgroundColor = easyColor;
  } else if (row.difficulty === 2) {
    style.backgroundColor = mediumColor;
  } else if (row.difficulty === 3) {
    style.backgroundColor = hardColor;
  }

  return <div style={style}></div>;
}

function returnVisibilityWindow(row, objectData, startTime, endTime) {
  return (
    <>
      <Box>
        {objectData.observationStart.toLocaleTimeString().slice(0, 5)}
        {" - "}
        {objectData.observationEnd.toLocaleTimeString().slice(0, 5)}
      </Box>
      <ObjectVisibilityLine
        startTime={startTime}
        endTime={endTime}
        observationStart={objectData.observationStart}
        observationEnd={objectData.observationEnd}
      />
    </>
  );
}

function returnNotes(row) {
  const borderRadius = "5px";
  const display = "inline-block";
  const padding = "2px 10px";
  const fontWeight = "bold";
  const margin = "2px";

  const commonStyle = {
    borderRadius,
    display,
    padding,
    fontWeight,
    margin,
  };

  const greatForBinocularsStyle = {
    ...commonStyle,
    backgroundColor: "#58ACAD",
    color: "#E0F5F5",
  };

  const binocularsNeededStyle = {
    ...commonStyle,
    backgroundColor: "#F8E1D4",
    color: "#F28D6D",
  };

  const largeSizeStyle = {
    ...commonStyle,
    backgroundColor: "#D9F1E1",
    color: "#72D1A6",
  };

  const bestAtHighMagnificationStyle = {
    ...commonStyle,
    backgroundColor: "#F5F1E0",
    color: "#E0B940",
  };

  const iconicStyle = {
    ...commonStyle,
    backgroundColor: "#D1C8F5",
    color: "#6A58E0",
  };

  const groupFriendlyStyle = {
    ...commonStyle,
    backgroundColor: "#F9E2F5",
    color: "#D66DCB",
  };

  const objectNotesPrefixesStyles = [
    {
      key: "great_for_binoculars",
      prefix: "Great for binoculars",
      style: greatForBinocularsStyle,
    },
    {
      key: "binoculars_needed",
      prefix: "Binoculars required",
      style: binocularsNeededStyle,
    },
    { key: "large_size", prefix: "Large size", style: largeSizeStyle },
    {
      key: "best_at_high_magnification",
      prefix: "Best at hight magnification",
      style: bestAtHighMagnificationStyle,
    },
    { key: "iconic", prefix: "Iconic", style: iconicStyle },
    {
      key: "group_friendly",
      prefix: "Group friendly",
      style: groupFriendlyStyle,
    },
  ];

  const notesList = objectNotesPrefixesStyles.map((e) => {
    if (row[e.key] === true) {
      return (
        <div key={e.key} style={e.style}>
          {e.prefix}
        </div>
      );
    }
  });

  return <Box>{notesList}</Box>;
}

export default function FilteredObjectsTable({
  latitude,
  longitude,
  angle,
  startTime,
  endTime,
}) {
  return (
    <>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Observed</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Difficulty</TableCell>
              <TableCell>Visibility Window</TableCell>
              <TableCell>Notes</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {wimmerTable.map((row) => {
              const objectData = observationFilter(
                row.nr,
                latitude,
                longitude,
                angle,
                startTime,
                endTime,
                row.ra_number,
                row.dec_number
              );
              if (objectData.available === false) {
                return;
              }

              // Filter out objects visible for less than 15 minutes
              const visibilityTime =
                objectData.observationEnd - objectData.observationStart;
              const minimumVisibilityTime = 15 * 60 * 1000; // 15 minutes
              if (visibilityTime < minimumVisibilityTime) {
                return;
              }

              return (
                <TableRow key={row.nr}>
                  <TableCell>
                    <Checkbox />
                  </TableCell>
                  <TableCell>{returnObjectName(row)}</TableCell>
                  <TableCell>{returnObjectType(row)}</TableCell>
                  <TableCell>{returnDifficulty(row)}</TableCell>
                  <TableCell>
                    {returnVisibilityWindow(
                      row,
                      objectData,
                      startTime,
                      endTime
                    )}
                  </TableCell>
                  <TableCell>{returnNotes(row)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
