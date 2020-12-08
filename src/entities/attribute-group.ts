import errors from "../errors";
import IEntity from "../interfaces/entity";
import type Model from "../model";
import { Multilang } from "../types";
import {
  TAttributeGroup,
  TAttributeGroupDescription,
} from "../types/attribute";
import { isInteger } from "../utils";

export default class AttributeGroup implements IEntity {
  constructor(private model: Model, private _id?: number) {}

  public data: Partial<TAttributeGroup> = {};

  public description: Multilang<TAttributeGroupDescription> = {};

  get id() {
    return this._id;
  }

  setData(newData: Partial<TAttributeGroup>) {
    this.data = { ...this.data, ...newData };
    return this;
  }

  setDescription(description: Partial<TAttributeGroupDescription>) {
    if (!isInteger(description.languageId))
      throw new Error(errors.NOT_SPECIFIED("description.language_id"));
    this.description[description.languageId] = { ...description };
    return this;
  }

  async insert() {
    if (isInteger(this._id)) throw new Error(errors.ENTITY_INSERTED);
    const { insertId } = await this.model.attribute.group.insert(this.data);
    this._id = insertId;
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.attribute.group.description.insert({
        ...this.description[langId],
        attributeGroupId: this._id,
        languageId: langId,
      });
    }
    return this;
  }

  async update() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.attribute.group.update(
      { attributeGroupId: this._id },
      {
        ...this.data,
        attributeGroupId: this._id,
      }
    );
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.attribute.group.description.update(
        { attributeGroupId: this._id, languageId: langId },
        {
          ...this.description[langId],
          attributeGroupId: this._id,
          languageId: langId,
        }
      );
    }
    return this;
  }

  async delete() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.attribute.group.delete({ attributeGroupId: this._id });
    await this.model.attribute.group.description.delete({
      attributeGroupId: this._id,
    });
    this._id = undefined;
    return this;
  }
}
