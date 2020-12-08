import type { TCategory, TCategoryDescription, TCategoryPath } from "../types";

export const initialCategory: TCategory = {
  image: "",
  parentId: 0,
  sortOrder: 0,
  top: 0,
  column: 0,
  status: 1,
  dateAdded: new Date(0),
  dateModified: new Date(0),
};

export const initialCategoryDescription: TCategoryDescription = {
  languageId: -1,
  name: "",
  description: "",
  metaTitle: "",
  metaH1: "",
  metaDescription: "",
  metaKeyword: "",
};

export const initialCategoryPath: TCategoryPath = {
  categoryId: 0,
  pathId: 0,
  level: 0,
};
