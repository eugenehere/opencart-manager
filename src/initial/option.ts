import {
  TOption,
  TOptionDescription,
  TOptionValue,
  TOptionValueDescription,
} from "../types";

export const initialOption: TOption = {
  type: "",
  sortOrder: 0,
};

export const initialOptionDescription: TOptionDescription = {
  languageId: -1,
  optionId: -1,
  name: "",
};

export const initialOptionValue: TOptionValue = {
  optionId: -1,
  image: "",
  sortOrder: 0,
};

export const initialOptionValueDescription: TOptionValueDescription = {
  optionId: -1,
  optionValueId: -1,
  languageId: -1,
  name: "",
};
