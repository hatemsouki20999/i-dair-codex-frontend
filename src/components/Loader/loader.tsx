import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

interface LoaderProps {
  width?: string;
}
export default function Loader(props: LoaderProps) {
  let { width } = props;
  return (
    <Box
      sx={{ display: "flex", justifyContent: "center" }}
      data-testid="loader"
    >
      <CircularProgress sx={width ? { width: width, height: width } : {}} />
    </Box>
  );
}
