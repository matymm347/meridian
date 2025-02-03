import { Height } from "@mui/icons-material";
import { Box } from "@mui/material";

export default function NoteBox({ id }) {
  const commonStyle = {
    borderRadius: "5px",
    display: "inline-block",
    padding: "2px 10px",
    fontWeight: "bold",
    margin: "2px",
  };

  const greatForBinocularsStyle = {
    ...commonStyle,
    backgroundColor: "#2C5354",
    color: "#E0F5F5",
  };

  const binocularsNeededStyle = {
    ...commonStyle,
    backgroundColor: "#46200B",
    color: "#F28B6A",
  };

  const largeSizeStyle = {
    ...commonStyle,
    backgroundColor: "#163c29",
    color: "#76d2a8",
  };

  const bestAtHighMagnificationStyle = {
    ...commonStyle,
    backgroundColor: "#2b250e",
    color: "#e2be4d",
  };

  const iconicStyle = {
    ...commonStyle,
    backgroundColor: "#2a2e30",
    color: "#705fe1",
  };

  const groupFriendlyStyle = {
    ...commonStyle,
    backgroundColor: "#3c0c33",
    color: "#d771cc",
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

  const selected = objectNotesPrefixesStyles.find((item) => item.key === id);
  const { style, prefix } = selected;

  return <Box style={style}>{prefix}</Box>;
}
