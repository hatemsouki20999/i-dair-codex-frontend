import { Grid } from "@mui/material";
import versionStyles from "../../styles/versionStyles";

interface versionPropsInterface {
  version: string;
}
const VersionDisplay = (props: versionPropsInterface) => {
  const { version } = props;
  const classes = versionStyles();
  return <Grid className={classes.versionDisplay}>{version}</Grid>;
};

export default VersionDisplay;
