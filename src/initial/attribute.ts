import {
  TAttribute,
  TAttributeDescription,
  TAttributeGroup,
  TAttributeGroupDescription,
} from "../types";

export const initialAttribute: TAttribute = {
  attributeGroupId: -1,
  sortOrder: 0,
};

export const initialAttributeDescription: TAttributeDescription = {
  attributeId: -1,
  languageId: 0,
  name: "",
};

export const initialAttributeGroup: TAttributeGroup = {
  sortOrder: 0,
};

export const initialAttributeGroupDescription: TAttributeGroupDescription = {
  attributeGroupId: -1,
  languageId: 0,
  name: "",
};
