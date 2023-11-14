import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  FormControl,
  Grid,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import BooleanVariable from "./booleanVariable";
import CategoricalVariable from "./categoricalVariable";
import NumericVariable from "./numericVariable";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import descriptiveStatisticsStyles from "../../styles/descriptiveStatisticsStyles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import {
  setExpandedList,
  setRoundDecimalNumber,
} from "../../redux/reducers/descriptiveStatistics.slice";
import { roundDecimalValues } from "../../utils/data";
import { useTranslation } from "react-i18next";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const ITEMS_PER_PAGE = 10; // Number of accordions to display per page

const DescriptiveStatistics = (props: { variables: any }) => {
  const { variables } = props;
  const { t } = useTranslation();
  const classes = descriptiveStatisticsStyles();
  const dispatch: AppDispatch = useDispatch();
  let { expandedList, roundDecimalNumber } = useSelector(
    (state: RootState) => state.descriptiveStatistics
  );
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate the start and end indices for the current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(
    startIndex + ITEMS_PER_PAGE,
    Object.keys(variables).length
  );

  const handlePageChange = (newPage: number) => {
    dispatch(
      setExpandedList(new Array(Object.keys(variables).length).fill(false))
    );
    setCurrentPage(newPage);
  };

  useEffect(() => {
    dispatch(
      setExpandedList(new Array(Object.keys(variables).length).fill(false))
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAllExpanded = expandedList.every((value: any) => value === true);

  const handleChangeAccordion = (index: number) => {
    let newExpanded: Array<boolean> = [...expandedList];
    newExpanded[index] = !newExpanded[index];
    dispatch(setExpandedList(newExpanded));
  };

  const handleChangeRoundValue = (event: SelectChangeEvent) => {
    dispatch(setRoundDecimalNumber(event.target.value));
  };
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container xs={12}>
        <Grid item xs={6}>
          <Typography className={classes.titleVariable}>
            {t("VARIABLES")}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Grid container className={classes.roundNumberContainer}>
            {" "}
            <Grid item xs={3}>
              <Typography>{t("ROUND_DECIMAL_NUMBER")}</Typography>
            </Grid>
            <Grid item xs={4}>
              {" "}
              <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
                <Select
                  value={roundDecimalNumber}
                  onChange={handleChangeRoundValue}
                >
                  {roundDecimalValues.map((elem: number) => {
                    return (
                      <MenuItem value={elem}>
                        <em>{elem}</em>
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid xs={11} className={classes.varibalesContainer}>
        {isAllExpanded ? (
          <>
            {Object.keys(variables).map((keyVariable, index) => (
              <Grid className={classes.accordionContainer}>
                <Accordion
                  key={index}
                  className={classes.accordion}
                  expanded={expandedList[index]}
                  onChange={() => {
                    handleChangeAccordion(index);
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{keyVariable}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <br />
                    {variables[keyVariable].type === "Numeric" && (
                      <NumericVariable
                        variable={variables[keyVariable]}
                        variableName={keyVariable}
                      />
                    )}
                    {variables[keyVariable].type === "Categorical" && (
                      <CategoricalVariable
                        variable={variables[keyVariable]}
                        variableName={keyVariable}
                      />
                    )}
                    {variables[keyVariable].type === "Boolean" && (
                      <BooleanVariable
                        variable={variables[keyVariable]}
                        variableName={keyVariable}
                      />
                    )}
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </>
        ) : (
          <>
            {Object.keys(variables)
              .slice(startIndex, endIndex)
              .map((keyVariable, index) => (
                <Grid className={classes.accordionContainer}>
                  <Accordion
                    key={index}
                    className={classes.accordion}
                    expanded={expandedList[index]}
                    onChange={() => {
                      handleChangeAccordion(index);
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography>{keyVariable}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <br />
                      {variables[keyVariable].type === "Numeric" && (
                        <NumericVariable
                          variable={variables[keyVariable]}
                          variableName={keyVariable}
                        />
                      )}
                      {variables[keyVariable].type === "Categorical" && (
                        <CategoricalVariable
                          variable={variables[keyVariable]}
                          variableName={keyVariable}
                        />
                      )}
                      {variables[keyVariable].type === "Boolean" && (
                        <BooleanVariable
                          variable={variables[keyVariable]}
                          variableName={keyVariable}
                        />
                      )}
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            <Box
              sx={{
                marginBottom: "40px",
                marginTop: "20px",
              }}
            >
              <Grid
                container
                direction="row"
                justifyContent="flex-end"
                alignItems="center"
                gap={2}
              >
                <Grid item>
                  <Button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    variant="outlined"
                    startIcon={<ArrowBackIosIcon />}
                  >
                    <Typography>{t("BUTTON_PREVIOUS")}</Typography>
                  </Button>
                </Grid>
                <Grid item>
                  <Button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={endIndex >= Object.keys(variables).length}
                    variant="outlined"
                    endIcon={<ArrowForwardIosIcon />}
                  >
                    <Typography>{t("BUTTON_NEXT")}</Typography>
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </>
        )}
      </Grid>
    </Box>
  );
};

export default DescriptiveStatistics;
