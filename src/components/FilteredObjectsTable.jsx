import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import { TableContainer } from "@mui/material";
import { Table } from "@mui/material";
import { TableHead } from "@mui/material";
import { TableRow } from "@mui/material";
import { TableCell } from "@mui/material";
import { TableBody } from "@mui/material";
import wimmerTable from "./wimmerTable";
import observationFilter from "./observationFilter";

function ObjectVisibilityLine({
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

  return (
    <>
      <Box
        sx={{ border: "1px solid blue", height: "20px", position: "relative" }}
      >
        <Box
          sx={{
            width: `${observationLineLength}%`,
            height: "100%",
            position: "absolute",
            left: `${observationStartOffset}%`,
            border: "1px solid red",
          }}
        ></Box>
      </Box>
    </>
  );
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
              <TableCell>Nr</TableCell>
              <TableCell>Above 30deg from</TableCell>
              <TableCell>Above 30deg to</TableCell>
              <TableCell>Graph</TableCell>
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
              if (objectData.available === true) {
                return (
                  <TableRow
                    key={row.nr}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>{row.nr}</TableCell>
                    <TableCell>
                      {objectData.observationStart.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      {objectData.observationEnd.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>
                      <ObjectVisibilityLine
                        startTime={startTime}
                        endTime={endTime}
                        observationStart={objectData.observationStart}
                        observationEnd={objectData.observationEnd}
                      />
                    </TableCell>
                  </TableRow>
                );
              }
              return null;
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
