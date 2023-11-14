import deepClone from "deep-clone";
import moment from "moment";
import base64 from "base64-js";
import Papa from "papaparse";
export const groupBy = (objectArray: any, property: any) => {
  return objectArray.reduce((acc: any, obj: any) => {
    const key = obj[property];
    const curGroup = acc[key] ?? [];

    return { ...acc, [key]: [...curGroup, obj] };
  }, {});
};

export const getSortedKeys = (object: any) => {
  return Object.keys(object).sort(function (a, b) {
    return parseInt(b) - parseInt(a);
  });
};

export const sortFnc = (p1: any, p2: any) => {
  if (p1.id_model < p2.id_model) return -1;
  if (p1.id_model > p2.id_model) return 1;
  return 0;
};

export const groupByTask = (array: any) => {
  return array.reduce((result: any, currentValue: any) => {
    (result[currentValue["task"]] = result[currentValue["task"]] || []).push(
      currentValue
    );
    return result;
  }, {});
};
export const convertToCSV = (data: any, metrics: Array<string>, t: any) => {
  const csvArray = [];
  // row's header
  csvArray.push([
    t("MODEL_NAME"),
    t("SESSION_NAME"),
    t("CREATED_AT"),
    t("TARGET_LABEL"),
    ...metrics,
  ]);
  // Add data in rows
  data.forEach((elem: any) => {
    let row = [
      elem.name,
      elem.sessionName,
      `${moment(elem.createdAt).format("DD/MM/YYYY HH:mm:SS")}`,
      elem.target,
    ];
    metrics.forEach((metric: string) => {
      row.push(elem[metric]);
    });
    csvArray.push(row);
  });
  return csvArray;
};

export const exportMetricsTable = (
  data: any,
  task: string,
  metrics: Array<string>,
  t: any
) => {
  const csvArray = convertToCSV(data, metrics, t);
  const csvString = Papa.unparse(csvArray, {
    quotes: true,
    delimiter: ",",
  });

  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${task} table.csv`;
  link.style.display = "none";

  link.click();

  URL.revokeObjectURL(url);
};

export const formatHyperParameters = (
  hyperParametersList: any,
  parasmTypes: any
) => {
  return hyperParametersList?.payload?.data?.map((model: any) => {
    let tempModel: any = deepClone(model);
    let modelType = parasmTypes?.payload?.data?.models?.find(
      (model: any) => tempModel.id === model.id
    );

    tempModel.checked = false;
    tempModel.advancedParams = false;
    tempModel.sklearnLink = modelType?.sklearn_link;
    tempModel.expanded = false;
    tempModel.featureSelection = false;

    Object.keys(tempModel?.hyperparameters)?.map((param: any) => {
      if (param === "n_iter") {
        tempModel.hyperparameters[param] = {
          defaultValue: model.hyperparameters[param],
          ...parasmTypes?.payload?.data.n_iter,
        };
      } else if (param === "parameter_search") {
        tempModel.hyperparameters[param] = {
          defaultValue: model.hyperparameters[param],
          ...parasmTypes?.payload?.data.parameter_search,
        };
      } else if (param === "folds_number") {
        tempModel.hyperparameters[param] = {
          defaultValue: model.hyperparameters[param],
          ...parasmTypes?.payload?.data.folds_number,
        };
      } else {
        let defaultValue: any;
        if (
          ["mixed array", "strings array"].includes(
            modelType?.params[param].type
          )
        ) {
          defaultValue = model.hyperparameters[param].map((elem: any) => {
            if (!elem) {
              return "None";
            } else {
              return elem;
            }
          });
        } else {
          defaultValue = model.hyperparameters[param];
        }
        tempModel.hyperparameters[param] = {
          defaultValue: defaultValue,
          ...modelType?.params[param],
        };
      }

      return true;
    });
    return tempModel;
  });
};

export const changeHyperparameterTraitement = (
  event: any,
  idModel: number,
  paramName: string,
  type: string,
  hyperParametersListByModel: any
) => {
  const floatRegex = /^-?\d*(\.\d+)?$/;
  let newValue;

  if (type === "ints array") {
    if (event.every((element: any) => Number.isInteger(parseFloat(element)))) {
      newValue = event;
    } else {
      newValue = event.filter((element: any) =>
        Number.isInteger(parseFloat(element))
      );
    }
  } else if (type === "floats array") {
    if (event.every((element: any) => floatRegex.test(element))) {
      newValue = event;
    } else {
      newValue = event.filter((element: any) => floatRegex.test(element));
    }
  } else {
    newValue = event;
  }

  let newHyperParametersListByModel: Array<any> = [
    ...hyperParametersListByModel,
  ];
  let indexModel = newHyperParametersListByModel.findIndex(
    (elem: any) => elem.id === idModel
  );
  if (indexModel !== -1) {
    let hyperparameters = deepClone(
      newHyperParametersListByModel[indexModel].hyperparameters
    );
    hyperparameters[paramName].defaultValue = newValue;
    newHyperParametersListByModel[indexModel] = {
      ...newHyperParametersListByModel[indexModel],
      hyperparameters: hyperparameters,
    };
  }
  return newHyperParametersListByModel;
};

export const changeMixedHyperparameters = (
  event: any,
  idModel: number,
  paramName: string,
  type: string,
  hyperParametersListByModel: any
) => {
  let newHyperParametersListByModel: Array<any> = [
    ...hyperParametersListByModel,
  ];
  let indexModel = newHyperParametersListByModel.findIndex(
    (elem: any) => elem.id === idModel
  );
  if (indexModel !== -1) {
    let hyperparameters = deepClone(
      newHyperParametersListByModel[indexModel].hyperparameters
    );
    let mixedArray: Array<any> = deepClone(
      hyperparameters[paramName].defaultValue
    );

    let newArray: Array<any> = [];
    let numbersArray: Array<string> = [];
    let stringsArray: Array<string> = [];

    mixedArray?.forEach((item: any) => {
      if (!isNaN(parseFloat(item))) {
        numbersArray.push(item);
      } else {
        if (
          hyperparameters[paramName]?.possible_values?.includes("string") &&
          hyperparameters[paramName]?.strings_values?.includes(item)
        ) {
          stringsArray.push(item);
        }
      }
    });

    if (type === "string") {
      newArray = numbersArray.concat(event);
    } else {
      newArray = stringsArray.concat(event);
    }

    hyperparameters[paramName].defaultValue = newArray;
    newHyperParametersListByModel[indexModel] = {
      ...newHyperParametersListByModel[indexModel],
      hyperparameters: hyperparameters,
    };
  }
  return newHyperParametersListByModel;
};

export const getSpecificArrayFromMixedArray = (
  mixedArray: any,
  type: string
) => {
  let numbersArray: Array<string> = [];
  let stringsArray: Array<string> = [];
  mixedArray?.forEach((item: any) => {
    if (!isNaN(parseFloat(item))) {
      numbersArray.push(item);
    } else {
      stringsArray.push(item);
    }
  });
  if (type === "string") {
    return stringsArray;
  } else if (type === "number") {
    return numbersArray;
  }
};

export const convertHyperParameterToSubmitFormat = (param: any) => {
  let paramValue: any;
  if (["ints array", "floats array"].includes(param?.type)) {
    paramValue = param?.defaultValue.map((elem: any) => parseFloat(elem));
  } else if (param.type === "mixed array") {
    let numbersArray =
      getSpecificArrayFromMixedArray(param?.defaultValue, "number")?.map(
        (elem: any) => parseFloat(elem)
      ) || [];
    let stringsArray =
      getSpecificArrayFromMixedArray(param?.defaultValue, "string")?.map(
        (elem) => {
          if (elem) {
            if (elem === "None") {
              return null;
            } else {
              return elem;
            }
          }
          return true;
        }
      ) || [];
    paramValue = [...stringsArray, ...numbersArray];
  } else if (param.type === "int") {
    paramValue = parseInt(param?.defaultValue);
  } else if (param.type === "strings array") {
    paramValue = param?.defaultValue.map((elem: string) => {
      if (elem) {
        if (elem === "None") {
          return null;
        } else {
          return elem;
        }
      }
      return true;
    });
  } else if (param.type === "int/none") {
    if (param?.defaultValue === "none") {
      paramValue = null;
    } else {
      paramValue = parseInt(param?.defaultValue)
        ? parseInt(param?.defaultValue)
        : "";
    }
  } else {
    paramValue = param?.defaultValue;
  }
  return paramValue;
};

function getRandomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const generateNonRepeatingRandomIntegers = (
  minValue: string,
  maxValue: string,
  count: number
) => {
  const numbers: Array<number> = [];
  const integerCount = Math.floor(
    parseInt(maxValue) - Math.ceil(parseFloat(minValue)) + 1
  );
  if (count <= integerCount) {
    for (let i = numbers.length; i < count; ) {
      const randomInt = getRandomInt(
        Math.ceil(parseFloat(minValue)),
        parseInt(maxValue)
      );

      if (!numbers.includes(randomInt)) {
        numbers.push(randomInt);
        i++;
      }
    }

    return numbers;
  } else {
    return [];
  }
};

export const generateNonRepeatingRandomMixed = (
  minValue: string,
  maxValue: string,
  count: number
) => {
  let numbers: Array<number> = [];

  for (let i = 0; i < count; i++) {
    if (i % 2 === 0) {
      let randomFloat = parseFloat(
        (
          Math.random() * (parseFloat(maxValue) - parseFloat(minValue)) +
          parseFloat(minValue)
        ).toFixed(3)
      );
      if (!numbers.includes(randomFloat)) {
        numbers.push(randomFloat);
      }
    } else {
      let randomInt =
        Math.floor(
          Math.random() * (parseFloat(maxValue) - parseFloat(minValue) + 1)
        ) + parseFloat(minValue);
      if (!numbers.includes(randomInt)) {
        numbers.push(randomInt);
      }
    }
  }

  return numbers;
};

export const changeListHyperParamWithSequenceValues = (
  hyperParametersListByModel: any,
  listOfValues: Array<string> | null,
  models: any,
  param: string
) => {
  let newListHyperParams: any = deepClone(hyperParametersListByModel);
  let modelIndex: number = newListHyperParams.findIndex(
    (elem: any) => elem.id === models.id
  );

  if (modelIndex !== -1 && listOfValues !== null) {
    newListHyperParams[modelIndex].hyperparameters[param] = {
      ...newListHyperParams[modelIndex].hyperparameters[param],
      defaultValue: listOfValues,
    };
  }
  return newListHyperParams;
};

export const changeListHyperParamWithSequenceValuesForMixedArray = (
  hyperParametersList: any,
  listOfValues: Array<string> | null,
  models: any,
  param: string
) => {
  let newHyperParametersListByModel: Array<any> = [...hyperParametersList];
  let modelIndex = newHyperParametersListByModel.findIndex(
    (elem: any) => elem.id === models.id
  );
  if (modelIndex !== -1) {
    let hyperparameters = deepClone(
      hyperParametersList[modelIndex].hyperparameters
    );
    let mixedArray: Array<any> = deepClone(hyperparameters[param].defaultValue);

    let newArray: Array<any> = [];
    let numbersArray: Array<string> = [];
    let stringsArray: Array<string> = [];

    mixedArray?.forEach((item: any) => {
      if (!isNaN(parseFloat(item))) {
        numbersArray.push(item);
      } else {
        if (
          hyperparameters[param]?.possible_values?.includes("string") &&
          hyperparameters[param]?.strings_values?.includes(item)
        ) {
          stringsArray.push(item);
        }
      }
    });

    if (listOfValues !== null) {
      newArray = stringsArray.concat(listOfValues);

      hyperparameters[param].defaultValue = newArray;
      newHyperParametersListByModel[modelIndex] = {
        ...newHyperParametersListByModel[modelIndex],
        hyperparameters: hyperparameters,
      };
    }
  }
  return newHyperParametersListByModel;
};

export const validateEmail = (email: string) => {
  // Email validation using regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const convertToUpperCase = (text: string) => {
  return text && text.toUpperCase();
};

export const convertToLowerCase = (text: string) => {
  return text && text.toLowerCase();
};

export const capitalizeText = (text: string) => {
  if (!text) return "";
  const words = text.split(" ");
  const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  const restOfWords = words.slice(1).map((word) => word.toLowerCase());
  return [firstWord, ...restOfWords].join(" ");
};

export const downloadDataAsCSV = (data: Array<string>, exportedData: any) => {
  data.forEach((fileName: string) => {
    const fileData = exportedData[fileName];
    const blob = new Blob([fileData]);
    // Create a temporary URL for the blob
    const url = URL.createObjectURL(blob);
    // Create a link element
    const link = document.createElement("a");
    link.href = url;

    link.download = fileName;
    document.body.appendChild(link);
    // Trigger the download
    link.click();
    // Clean up
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  });
};
export const objectToCSV = (obj: any) => {
  const csv = [];
  csv.push("feature,score");
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const feature = key;
      const score = obj[key];
      csv.push(`${feature},${score}`);
    }
  }
  return csv.join("\n");
};

export const downloadCSV = (data: any, fileName: string) => {
  const blob = new Blob([data], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName || "data.csv";
  document.body.appendChild(link);
  link.click();
  URL.revokeObjectURL(url);
  document.body.removeChild(link);
};

export const downloadDataByFileType = async (
  file: string,
  filtredModelIds: any,
  exportedData: any,
  listTrainedModel: any
) => {
  let filesNames: Array<string> = [];
  await filtredModelIds.forEach((idModel: number) => {
    let model: any = listTrainedModel.find(
      (model: any) => model.id === idModel
    );
    if (model) {
      filesNames.push(`${model?.name}-${model?.sessionName}-${file}.csv`);
    }
  });
  downloadDataAsCSV(filesNames, exportedData);
};

export const downloadPlots = (data: any) => {
  if (data) {
    let fileName = "plot-associated-data.csv";
    const encodedData = data[fileName];
    const decodedData = new TextDecoder("utf-8").decode(
      base64.toByteArray(encodedData)
    );
    const byteArray = new Uint8Array(decodedData.length);
    for (let i = 0; i < decodedData.length; i++) {
      byteArray[i] = decodedData.charCodeAt(i);
    }
    const blob = new Blob([byteArray]);
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(link);
  }
};
export const extractDomain = (email: string) => {
  if (!email) {
    return false;
  }
  const parts = email?.split("@");
  if (parts.length === 2) {
    const domain = parts[1];
    return domain;
  }
};

export const removeDuplicates = (arr: number[]) => {
  const uniqueArray: number[] = [];
  for (const item of arr) {
    if (!uniqueArray.includes(item)) {
      uniqueArray.push(item);
    }
  }
  return uniqueArray;
};

export const getMetricsKey = (array: Array<any>) => {
  let metrics: Array<string> = [];
  array?.map((model: any) => {
    const temp = model.metrics?.map((metric: any) => {
      return metric.key;
    });
    metrics.push(...temp);
    return true;
  });
  return Array.from(new Set(metrics));
};

export const areAllArraysEmpty = (obj: any) => {
  for (const key in obj) {
    if (Array.isArray(obj[key]) && obj[key].length > 0) {
      return false;
    }
  }
  return true;
};
