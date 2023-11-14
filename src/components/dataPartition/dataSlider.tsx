import {
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Slider,
  TextField,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import sliderStyles from "../../styles/sliderStyles";
import {
  setSelectedSplitPercent,
  setShuffle,
} from "../../redux/reducers/dataPartition.slice";
import { useTranslation } from "react-i18next";

const DataSlider = () => {
  const classes = sliderStyles();
  const { t } = useTranslation();
  const dispatch: AppDispatch = useDispatch();
  const { selectedSplitPercent, shuffle } = useSelector(
    (state: RootState) => state.dataPartition
  );
  const handleChangeSelectedSplitPercentage = (event: any) => {
    dispatch(
      setSelectedSplitPercent({
        ...selectedSplitPercent,
        training: +event.target.value,
        validation: 100 - event.target.value,
      })
    );
  };

  const handleChangeValidation = (event: any) => {
    dispatch(
      setSelectedSplitPercent({
        ...selectedSplitPercent,
        training: 100 - event.target.value,
        validation: +event.target.value,
      })
    );
  };
  const handleChangeSeed = (event: any) => {
    const inputValue = event.target.value;
    if (/^\d*\.?\d*$/.test(inputValue)) {
      const parsedValue = parseFloat(inputValue);
      if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= 10000) {
        dispatch(
          setSelectedSplitPercent({
            ...selectedSplitPercent,
            seed: parsedValue,
          })
        );
      }
    }
  };

  const handleChangeShuffle = (event: any) => {
    dispatch(setShuffle(event.target.value));
  };

  return (
    <div className={classes.globalContainer}>
      <Grid container>
        <Grid container item xs={3.5}>
          <Typography gutterBottom className={classes.text}>
            {t("TRAINING")} &ensp;
          </Typography>
          <Input
            value={selectedSplitPercent.training}
            size="small"
            onChange={handleChangeSelectedSplitPercentage}
            disableUnderline
            inputProps={{
              step: 1,
              min: 0,
              max: 100,
              type: "tel",
            }}
            className={classes.input}
          />
          {"%"}
        </Grid>
        <Grid container item xs={4}>
          <Typography gutterBottom className={classes.text}>
            {t("VALIDATION")} &ensp;
          </Typography>
          <Input
            value={selectedSplitPercent.validation}
            size="small"
            onChange={handleChangeValidation}
            disableUnderline
            inputProps={{
              step: 1,
              min: 0,
              max: 100,
              type: "tel",
            }}
            className={classes.input}
          />
          {"%"}
        </Grid>
      </Grid>
      <Grid container className={classes.sliderContainer}>
        <Slider
          valueLabelDisplay="auto"
          value={selectedSplitPercent.training}
          onChange={handleChangeSelectedSplitPercentage}
        />
      </Grid>
      <Grid container className={classes.suffleContainer}>
        {" "}
        <FormControl component="fieldset">
          <RadioGroup row value={shuffle} onChange={handleChangeShuffle}>
            <FormControlLabel
              value={1}
              control={<Radio />}
              label={t("SHUFFLE")}
            />
            <FormControlLabel
              value={0}
              control={<Radio />}
              label={t("NO_SHUFFLE")}
            />
          </RadioGroup>
        </FormControl>
      </Grid>
      {shuffle === "1" && (
        <>
          <Typography gutterBottom className={classes.randomSeedText}>
            {t("RANDOM_SEED")}
          </Typography>
          <TextField
            type="number"
            InputProps={{
              inputProps: { min: 1 },
            }}
            value={selectedSplitPercent.seed}
            label={t("RANDOM_SEED")}
            variant="outlined"
            onChange={handleChangeSeed}
          />
        </>
      )}
    </div>
  );
};

export default DataSlider;
