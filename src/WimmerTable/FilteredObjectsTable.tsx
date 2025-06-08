import Box from "@mui/material/Box";
import wimmerTable from "./wimmerTable";
import ObjectVisibilityLine from "./ObjectVisibilityLine";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import * as Astronomy from "astronomy-engine";
import NoteBox from "./NoteBox";
import { Button } from "@mui/material";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";

const objectNotesIds = [
  "great_for_binoculars",
  "binoculars_needed",
  "large_size",
  "best_at_high_magnification",
  "iconic",
  "group_friendly",
];

function observationFilter(
  latitude: number,
  longitude: number,
  angle: number,
  startTime: Date,
  endTime: Date,
  ra: number,
  dec: number
) {
  const startTimeAstro = Astronomy.MakeTime(startTime);
  const endTimeAstro = Astronomy.MakeTime(endTime);
  const observer = new Astronomy.Observer(latitude, longitude, 0);

  let dateForLastMidnight = new Date(startTime);
  dateForLastMidnight.setUTCHours(0);
  const lastMidnightTime = Astronomy.MakeTime(dateForLastMidnight);

  Astronomy.DefineStar(Astronomy.Body.Star1, ra, dec, 1000);

  const startAz = Astronomy.Horizon(
    startTimeAstro,
    observer,
    ra,
    dec,
    "normal"
  );

  const atTargetAngleAscend = Astronomy.SearchAltitude(
    Astronomy.Body.Star1,
    observer,
    1,
    lastMidnightTime,
    1,
    angle
  );

  let atTargetAngleDescend = Astronomy.SearchAltitude(
    Astronomy.Body.Star1,
    observer,
    -1,
    lastMidnightTime,
    1,
    angle
  );

  if (atTargetAngleAscend && atTargetAngleDescend) {
    // If not null
    if (atTargetAngleDescend < atTargetAngleAscend) {
      atTargetAngleDescend = Astronomy.SearchAltitude(
        Astronomy.Body.Star1,
        observer,
        -1,
        atTargetAngleAscend,
        1,
        angle
      );
    }
  }

  interface ObjectData {
    available: boolean;
    observationStart: Date | null;
    observationEnd: Date | null;
  }

  const objectData: ObjectData = {
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
  if (atTargetAngleAscend && atTargetAngleDescend) {
    if (
      (atTargetAngleAscend < startTimeAstro &&
        atTargetAngleDescend < startTimeAstro) ||
      (atTargetAngleAscend > endTimeAstro &&
        atTargetAngleDescend > endTimeAstro)
    ) {
      return objectData;
    }
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

function returnObjectName(
  params: GridRenderCellParams<
    any,
    {
      messier?: number | null;
      ngc?: number | null;
      mel?: number | null;
      ic?: number | null;
    }
  >
): string {
  const catalogPrefixes = [
    { key: "messier", prefix: "M" },
    { key: "ngc", prefix: "NGC " },
    { key: "mel", prefix: "Mel " },
    { key: "ic", prefix: "IC " },
  ] as const;

  const result = catalogPrefixes.find(
    ({ key }) => params?.value?.[key] !== null
  );
  if (result) {
    return `${result.prefix}${params?.value?.[result.key]}`;
  } else {
    return "";
  }
}

function returnObjectType(
  params: GridRenderCellParams<
    any,
    {
      galaxy: boolean | null;
      open_cluster: boolean | null;
      globular_cluster: boolean | null;
      double_star: boolean | null;
      nebula: boolean | null;
      diffuse_nebulae: boolean | null;
      emmision_nebulae: boolean | null;
      reflection_nebulae: boolean | null;
      planetary_nebulae: boolean | null;
    }
  >
): React.ReactNode {
  const style: React.CSSProperties = {
    borderRadius: "8px",
    padding: "2px 4px",
    fontSize: "12px",
    border: "1px solid blue",
    margin: "1px",
  };

  const objectTypePrefixes = [
    { key: "galaxy", prefix: "Galaxy" },
    { key: "open_cluster", prefix: "Open Cluster" },
    { key: "globular_cluster", prefix: "Globular Cluster" },
    { key: "double_star", prefix: "Double Star" },
    { key: "nebula", prefix: "Nebulae" },
    { key: "diffuse_nebulae", prefix: "Diffuse Nebulae" },
    { key: "emmision_nebulae", prefix: "Emmision Nebulae" },
    { key: "reflection_nebulae", prefix: "Reflection Nebulae" },
    { key: "planetary_nebulae", prefix: "Planetary Nebulae" },
  ] as const;

  const objectType = objectTypePrefixes.filter(
    ({ key }) => params?.value?.[key] !== false
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {objectType.map((type) => {
        return (
          <div key={type.key} style={style}>
            {type.prefix}
          </div>
        );
      })}
    </Box>
  );
}

function returnDifficulty(params: GridRenderCellParams<any, 1 | 2 | 3>) {
  const difficulty = params.value;

  const style: React.CSSProperties = {
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    margin: "auto",
  };

  const easyColor = "#4CAF50";
  const mediumColor = "#FFA726";
  const hardColor = "#FF6B6B";

  if (difficulty === 1) {
    style.backgroundColor = easyColor;
  } else if (difficulty === 2) {
    style.backgroundColor = mediumColor;
  } else if (difficulty === 3) {
    style.backgroundColor = hardColor;
  }

  return <div style={style}></div>;
}

function returnVisibilityWindow(
  prop: GridRenderCellParams<
    any,
    {
      objectData: { observationStart: Date; observationEnd: Date };
      startTime: Date;
      endTime: Date;
    }
  >
) {
  return (
    <>
      <Box>
        <Box>
          {prop?.value?.objectData.observationStart
            .toLocaleTimeString()
            .slice(0, 5)}
          {" - "}
          {prop?.value?.objectData.observationEnd
            .toLocaleTimeString()
            .slice(0, 5)}
        </Box>
        {prop?.value?.startTime && prop?.value?.endTime && (
          <ObjectVisibilityLine
            startTime={prop.value.startTime}
            endTime={prop.value.endTime}
            observationStart={prop.value.objectData.observationStart}
            observationEnd={prop.value.objectData.observationEnd}
          />
        )}
      </Box>
    </>
  );
}

function returnNotes(
  params: GridRenderCellParams<any, { [id: string]: boolean }>
) {
  const notesList = objectNotesIds.map((id) => {
    if (params?.value?.[id]) {
      return <NoteBox key={id} id={id} />;
    }
  });

  return <Box>{notesList}</Box>;
}

type FilteredObjectsTableProps = {
  latitude: number;
  longitude: number;
  angle: number;
  startTime: Date;
  endTime: Date;
};

export default function FilteredObjectsTable({
  latitude,
  longitude,
  angle,
  startTime,
  endTime,
}: FilteredObjectsTableProps) {
  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      renderCell: returnObjectName,
      sortable: false,
    },
    {
      field: "type",
      headerName: "Type",
      renderCell: returnObjectType,
      display: "flex",
    },
    {
      field: "difficulty",
      headerName: "Difficulty",
      renderCell: returnDifficulty,
      display: "flex",
      headerAlign: "center",
    },
    {
      field: "visibility",
      headerName: "Visibility Window",
      renderCell: returnVisibilityWindow,
      display: "flex",
      width: 130,
      sortable: false,
    },
    {
      field: "notes",
      headerName: "Notes",
      renderCell: returnNotes,
      display: "flex",
      flex: 1,
    },
  ];

  const rows = wimmerTable
    .map((row) => {
      const objectData = observationFilter(
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
      let visibilityTime = 0;

      if (objectData.observationStart && objectData.observationEnd) {
        visibilityTime =
          objectData.observationEnd.getTime() -
          objectData.observationStart.getTime();
      }
      const minimumVisibilityTime = 15 * 60 * 1000; // 15 minutes
      if (visibilityTime < minimumVisibilityTime) {
        return;
      }

      return {
        id: row.nr,
        name: row,
        type: row,
        difficulty: row.difficulty,
        visibility: { objectData, startTime, endTime },
        notes: row,
      };
    })
    .filter((row) => row !== undefined);

  return (
    <>
      <Box sx={{ margin: "20px" }}>
        {objectNotesIds.map((id) => (
          <Button key={id} size="small">
            <NoteBox id={id} />
          </Button>
        ))}
      </Box>
      <Paper sx={{ height: 800, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          sx={{
            border: 0,
          }}
          hideFooterPagination={false}
        />
      </Paper>
    </>
  );
}
