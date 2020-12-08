import errors from "../errors";
import IEntity from "../interfaces/entity";
import type Model from "../model";
import { Multilang } from "../types";
import { TOption, TOptionDescription } from "../types/option";
import { isInteger } from "../utils";

export default class Option implements IEntity {
  constructor(private model: Model, private _id?: number) {}

  public data: Partial<TOption> = {};

  public description: Multilang<TOptionDescription> = {};

  get id(): number | undefined {
    return this._id;
  }

  setData(newData: Partial<TOption>) {
    this.data = { ...this.data, ...newData };
    return this;
  }

  setDescription(description: Partial<TOptionDescription>) {
    if (!isInteger(description.languageId))
      throw new Error(errors.NOT_SPECIFIED("description.language_id"));
    this.description[description.languageId] = { ...description };
    return this;
  }

  async insert() {
    if (isInteger(this._id)) throw new Error(errors.ENTITY_INSERTED);
    const { insertId } = await this.model.option.insert(this.data);
    this._id = insertId;
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.option.description.insert({
        ...this.description[langId],
        optionId: this._id,
        languageId: langId,
      });
    }
    return this;
  }

  async update() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.option.update(
      { optionId: this._id },
      {
        ...this.data,
        optionId: this._id,
      }
    );
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.option.description.update(
        {
          optionId: this._id,
          languageId: langId,
        },
        {
          ...this.description[langId],
          optionId: this._id,
          languageId: langId,
        }
      );
    }
    return this;
  }

  async delete() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.option.delete({ optionId: this._id });
    await this.model.option.description.delete({ optionId: this._id });
    this._id = undefined;
    return this;
  }
}
