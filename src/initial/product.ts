import type {
  TProduct,
  TProductAttribute,
  TProductDescription,
  TProductImage,
  TProductOption,
  TProductOptionValue,
  TProductSpecial,
} from "../types";

export const initialProduct: TProduct = {
  model: "model",
  sku: "",
  upc: "",
  ean: "",
  jan: "",
  isbn: "",
  mpn: "",
  location: "",
  quantity: 0,
  stockStatusId: 0,
  image: "",
  manufacturerId: 0,
  price: 0,
  taxClassId: 0,
  status: 1,
  dateAdded: new Date(0),
  dateModified: new Date(0),
  shipping: 0,
  points: 0,
  dateAvailable: new Date(0),
  weight: 0,
  weightClassId: 0,
  length: 0,
  width: 0,
  height: 0,
  lengthClassId: 0,
  subtract: 0,
  minimum: 0,
  sortOrder: 0,
  viewed: 0,
};

export const initialProductDescription: TProductDescription = {
  languageId: -1,
  productId: -1,
  name: "",
  description: "",
  tag: "",
  metaTitle: "",
  metaH1: "",
  metaDescription: "",
  metaKeyword: "",
};

export const initialProductOption: TProductOption = {
  optionId: -1,
  productId: -1,
  value: "",
  required: 1,
};

export const initialProductOptionValue: TProductOptionValue = {
  optionId: -1,
  optionValueId: -1,
  productId: -1,
  productOptionId: -1,
  quantity: 1,
  subtract: 1,
  price: 0,
  pricePrefix: "+",
  points: 0,
  pointsPrefix: "+",
  weight: 0,
  weightPrefix: "+",
};

export const initialProductAttribute: TProductAttribute = {
  productId: 0,
  attributeId: 0,
  languageId: 0,
  text: "",
};

export const initialProductSpecial: TProductSpecial = {
  productId: -1,
  customerGroupId: 1,
  priority: 1,
  price: 0,
  dateStart: new Date(0),
  dateEnd: new Date("9999"),
};

export const initialProductImage: TProductImage = {
  productId: -1,
  image: "",
  sortOrder: 0,
};
