import { TextField, Typography, Grid } from "@mui/material";

import inputComponentStyles from "../../styles/inputComponentStyles";
import { IInputComponent } from "../../interfaces/upload.interface";

export default function InputComponent({
  name,
  label,
  changeHandler,
  state,
  title,
}: IInputComponent) {
  const classes = inputComponentStyles();
  return (
    <Grid container className={classes.content}>
      <Grid item xs={4}>
        {" "}
        <Typography className={classes.label}>{name}</Typography>
      </Grid>
      <Grid item xs={8}>
        <TextField
          title={title}
          error={state.errorMessage.length !== 0 ? true : false}
          helperText={state.errorMessage}
          label={label}
          color="primary"
          variant="outlined"
          size="small"
          margin="normal"
          required
          onChange={changeHandler}
          value={state.value}
          sx={{ width: "25vw" }}
        />
      </Grid>
    </Grid>
  );
}
