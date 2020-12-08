import errors from "../errors";
import IEntity from "../interfaces/entity";
import type Model from "../model";
import { Multilang } from "../types";
import { TManufacturer, TManufacturerDescription } from "../types/manufacturer";
import { isInteger } from "../utils";

export default class Manufacturer implements IEntity {
  constructor(private model: Model, private _id?: number) {}

  public data: Partial<TManufacturer> = {};

  public description: Multilang<TManufacturerDescription> = {};

  get id(): number | undefined {
    return this._id;
  }

  setData(newData: Partial<TManufacturer>) {
    this.data = { ...this.data, ...newData };
    return this;
  }

  setDescription(description: Partial<TManufacturerDescription>) {
    if (!isInteger(description.languageId))
      throw new Error(errors.NOT_SPECIFIED("description.language_id"));
    this.description[description.languageId] = { ...description };
    return this;
  }

  async insert() {
    if (isInteger(this._id)) throw new Error(errors.ENTITY_INSERTED);
    const { insertId } = await this.model.manufacturer.insert(this.data);
    this._id = insertId;
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.manufacturer.description.insert({
        ...this.description[langId],
        manufacturerId: this._id,
        languageId: langId,
      });
    }
    return this;
  }

  async update() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.manufacturer.update(
      { manufacturerId: this.id },
      {
        ...this.data,
        manufacturerId: this.id,
      }
    );
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.manufacturer.description.update(
        { manufacturerId: this.id, languageId: langId },
        {
          ...this.description[langId],
          manufacturerId: this._id,
          languageId: langId,
        }
      );
    }
    return this;
  }

  async delete() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.manufacturer.delete({ manufacturerId: this._id });
    await this.model.manufacturer.description.delete({
      manufacturerId: this._id,
    });
    this._id = undefined;
    return this;
  }
}
