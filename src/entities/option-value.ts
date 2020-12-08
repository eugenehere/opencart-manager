import errors from "../errors";
import IEntity from "../interfaces/entity";
import type Model from "../model";
import { Multilang, TOptionValue, TOptionValueDescription } from "../types";
import { isInteger } from "../utils";

export default class OptionValue implements IEntity {
  constructor(
    private model: Model,
    private optionId: number,
    private _id?: number
  ) {}

  public data: Partial<TOptionValue> = {};

  public description: Multilang<TOptionValueDescription> = {};

  get id(): number | undefined {
    return this._id;
  }

  setData(newData: Partial<TOptionValue>) {
    this.data = { ...this.data, ...newData };
    return this;
  }

  setDescription(description: Partial<TOptionValueDescription>) {
    if (!isInteger(description.languageId))
      throw new Error(errors.NOT_SPECIFIED("description.language_id"));
    this.description[description.languageId] = { ...description };
    return this;
  }

  async insert() {
    if (isInteger(this._id)) throw new Error(errors.ENTITY_INSERTED);
    const { insertId } = await this.model.option.value.insert({
      ...this.data,
      optionId: this.optionId,
    });
    this._id = insertId;
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.option.value.description.insert({
        ...this.description[langId],
        optionValueId: this._id,
        optionId: this.optionId,
        languageId: langId,
      });
    }
    return this;
  }

  async update() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.option.value.update(
      { optionValueId: this._id },
      {
        ...this.data,
        optionId: this.optionId,
        optionValueId: this._id,
      }
    );
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.option.value.description.update(
        {
          optionValueId: this._id,
          languageId: langId,
        },
        {
          ...this.description[langId],
          optionValueId: this._id,
          optionId: this.optionId,
          languageId: langId,
        }
      );
    }
    return this;
  }

  async delete() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.option.value.delete({ optionValueId: this._id });
    await this.model.option.value.description.delete({
      optionValueId: this._id,
    });
    this._id = undefined;
    return this;
  }
}
