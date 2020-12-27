export type TProduct = {
  productId?: number;
  model: string;
  sku: string;
  upc: string;
  ean: string;
  jan: string;
  isbn: string;
  mpn: string;
  location: string;
  quantity: number;
  stockStatusId: number;
  image: string;
  manufacturerId: number;
  shipping: number;
  price: number;
  points: number;
  taxClassId: number;
  dateAvailable: Date;
  weight: number;
  weightClassId: number;
  length: number;
  width: number;
  height: number;
  lengthClassId: number;
  subtract: number;
  minimum: number;
  sortOrder: number;
  status: number;
  viewed: number;
  dateAdded: Date;
  dateModified: Date;
};

export type TProductDescription = {
  productId: number;
  languageId: number;
  name: string;
  description: string;
  tag: string;
  metaTitle: string;
  metaH1: string;
  metaDescription: string;
  metaKeyword: string;
};

export type TProductOption = {
  productOptionId?: number;
  productId: number;
  optionId: number;
  value: string;
  required: number;
};

export type TProductOptionValue = {
  productOptionValueId?: number;
  productOptionId: number;
  productId: number;
  optionId: number;
  optionValueId: number;
  quantity: number;
  subtract: number;
  price: number;
  pricePrefix: string;
  points: number;
  pointsPrefix: string;
  weight: number;
  weightPrefix: string;
};

export type TProductAttribute = {
  productId: number;
  attributeId: number;
  languageId: number;
  text: string;
};

export type TProductSpecial = {
  productSpecialId?: number;
  productId: number;
  customerGroupId: number;
  priority: number;
  price: number;
  dateStart: Date;
  dateEnd: Date;
};
