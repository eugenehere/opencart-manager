export type TAttribute = {
  attributeId?: number;
  attributeGroupId: number;
  sortOrder: number;
};

export type TAttributeDescription = {
  attributeId: number;
  languageId: number;
  name: string;
};

export type TAttributeGroup = {
  attributeGroupId?: number;
  sortOrder: number;
};

export type TAttributeGroupDescription = {
  attributeGroupId: number;
  languageId: number;
  name: string;
};
