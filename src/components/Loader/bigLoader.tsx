import { Grid } from "@mui/material";
import loaderStyles from "../../styles/loaderStyles";
import Loader from "./loader";

export default function BigLoader() {
  const classes = loaderStyles();
  return (
    <Grid container className={classes.centerLoader}>
      <Loader width="100px !important" />
    </Grid>
  );
}
