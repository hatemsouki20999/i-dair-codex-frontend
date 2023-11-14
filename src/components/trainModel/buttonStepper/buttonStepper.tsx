import { Button } from "@mui/material";
import { Stack } from "@mui/system";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { IButtonProps } from "../../../interfaces/trainModel.interface";
import { RootState } from "../../../redux/store/store";
import StepperStyles from "../../../styles/StepperStyles";

export default function ButtonStepper({
  onClick,
  disableBack = false,
  disableNext = false,
  onClickBack,
}: IButtonProps) {
  const { t } = useTranslation();
  const classes = StepperStyles();
  const { activeStep } = useSelector((state: RootState) => state.trainModel);
  return (
    <Stack display={"flex"} flexDirection={"row"} justifyContent={"flex-end"}>
      {activeStep !== 0 && (
        <Button
          variant="contained"
          className={classes.backBtn}
          disabled={disableBack}
          onClick={onClickBack}
        >
          {t("BUTTON_BACK").toString()}
        </Button>
      )}

      {activeStep !== 3 ? (
        <Button
          variant="contained"
          color="primary"
          disabled={disableNext}
          className={classes.buttonStepper}
          onClick={onClick}
        >
          {t("BUTTON_NEXT").toString()}
        </Button>
      ) : (
        <></>
      )}
    </Stack>
  );
}
