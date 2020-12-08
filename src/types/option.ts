export type TOption = {
  optionId?: number;
  type: string;
  sortOrder: number;
};

export type TOptionDescription = {
  optionId: number;
  languageId: number;
  name: string;
};

export type TOptionValue = {
  optionValueId?: number;
  optionId: number;
  image: string;
  sortOrder: number;
};

export type TOptionValueDescription = {
  optionValueId: number;
  languageId: number;
  optionId: number;
  name: string;
};
