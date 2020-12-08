import errors from "../errors";
import IEntity from "../interfaces/entity";
import type Model from "../model";
import { Multilang, TAttribute, TAttributeDescription } from "../types";
import { isInteger } from "../utils";

export default class Attribute implements IEntity {
  constructor(
    private model: Model,
    private attributeGroupId: number,
    private _id?: number
  ) {}

  public data: Partial<TAttribute> = {};

  public description: Multilang<TAttributeDescription> = {};

  get id() {
    return this._id;
  }

  setData(newData: Partial<TAttribute>) {
    this.data = { ...this.data, ...newData };
    return this;
  }

  setDescription(description: Partial<TAttributeDescription>) {
    if (!isInteger(description.languageId))
      throw new Error(errors.NOT_SPECIFIED("description.language_id"));
    this.description[description.languageId] = { ...description };
    return this;
  }

  async insert() {
    if (isInteger(this._id)) throw new Error(errors.ENTITY_INSERTED);
    const { insertId } = await this.model.attribute.insert({
      ...this.data,
      attributeGroupId: this.attributeGroupId,
    });
    this._id = insertId;
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.attribute.description.insert({
        ...this.description[langId],
        attributeId: this._id,
        languageId: langId,
      });
    }
    return this;
  }

  async update() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.attribute.update(
      { attributeId: this._id },
      {
        ...this.data,
        attributeId: this._id,
        attributeGroupId: this.attributeGroupId,
      }
    );
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.attribute.description.update(
        { attributeId: this._id, languageId: langId },
        {
          ...this.description[langId],
          attributeId: this._id,
          languageId: langId,
        }
      );
    }
    return this;
  }

  async delete() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.attribute.delete({ attributeId: this._id });
    await this.model.attribute.description.delete({ attributeId: this._id });
    this._id = undefined;
    return this;
  }
}
