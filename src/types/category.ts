export type TCategory = {
  categoryId?: number;
  image: string;
  parentId: number;
  top: number;
  column: number;
  sortOrder: number;
  status: number;
  dateAdded: Date;
  dateModified: Date;
};

export type TCategoryDescription = {
  categoryId?: number;
  languageId: number;
  name: string;
  description: string;
  metaTitle: string;
  metaH1: string;
  metaDescription: string;
  metaKeyword: string;
};

export type TCategoryPath = {
  categoryId: number;
  pathId: number;
  level: number;
};
