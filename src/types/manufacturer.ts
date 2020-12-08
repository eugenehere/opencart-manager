export type TManufacturer = {
  manufacturerId?: number;
  name: string;
  image: string;
  sortOrder: number;
};

export type TManufacturerDescription = {
  manufacturerId: number;
  languageId: number;
  name: string;
  description: string;
  metaTitle: string;
  metaH1: string;
  metaDescription: string;
  metaKeyword: string;
};
