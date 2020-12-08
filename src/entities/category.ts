import errors from "../errors";
import IEntity from "../interfaces/entity";
import type Model from "../model";
import type { Multilang } from "../types";
import { TCategory, TCategoryDescription } from "../types/category";
import { isInteger } from "../utils";

export default class Category implements IEntity {
  constructor(private model: Model, private _id?: number) {
    this.data.dateAdded = new Date();
    this.data.dateModified = new Date();
  }

  public data: Partial<TCategory> = {};

  public description: Multilang<TCategoryDescription> = {};

  get id() {
    return this._id;
  }

  setData(newData: Partial<TCategory>) {
    this.data = { ...this.data, ...newData };
    return this;
  }

  setDescription(description: Partial<TCategoryDescription>) {
    if (!isInteger(description.languageId))
      throw new Error(errors.NOT_SPECIFIED("description.language_id"));
    this.description[description.languageId] = { ...description };
    return this;
  }

  async insert() {
    if (isInteger(this._id)) throw new Error(errors.ENTITY_INSERTED);
    const { insertId } = await this.model.category.insert(this.data);
    this._id = insertId;
    await this.model.category.toStore(this._id, 0);
    await this.model.category.toLayout(this._id, 0, 0);
    await this.model.category.path.insert({
      categoryId: this._id,
      pathId: this._id,
      level: 0,
    });
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.category.description.insert({
        ...this.description[langId],
        categoryId: this._id,
        languageId: langId,
      });
    }
    return this;
  }

  async update() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.category.update(
      { categoryId: this._id },
      {
        ...this.data,
        categoryId: this._id,
      }
    );
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.category.description.update(
        { categoryId: this._id, languageId: langId },
        {
          ...this.description[langId],
          categoryId: this._id,
          languageId: langId,
        }
      );
    }
    return this;
  }

  async delete() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.category.delete({ categoryId: this._id });
    await this.model.category.description.delete({ categoryId: this._id });
    this._id = undefined;
    return this;
  }
}
