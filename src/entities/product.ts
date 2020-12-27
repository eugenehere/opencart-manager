import errors from "../errors";
import IEntity from "../interfaces/entity";
import type Model from "../model";
import type {
  Multilang,
  TProduct,
  TProductAttribute,
  TProductDescription,
} from "../types";
import { isInteger } from "../utils";
import Attribute from "./attribute";
import Category from "./category";

export default class Product implements IEntity {
  constructor(private model: Model, private _id?: number) {
    this.data.dateAdded = new Date();
    this.data.dateModified = new Date();
  }

  public data: Partial<TProduct> = {};

  public description: Multilang<TProductDescription> = {};

  get id(): number | undefined {
    return this._id;
  }

  setData(newData: Partial<TProduct>) {
    this.data = { ...this.data, ...newData };
    return this;
  }

  setDescription(description: Partial<TProductDescription>) {
    if (!isInteger(description.languageId))
      throw new Error(errors.NOT_SPECIFIED("description.language_id"));
    this.description[description.languageId] = { ...description };
    return this;
  }

  async insert() {
    if (isInteger(this._id)) throw new Error(errors.ENTITY_INSERTED);
    const { insertId } = await this.model.product.insert(this.data);
    this._id = insertId;
    await this.model.product.toStore(this._id, 0);
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.product.description.insert({
        ...this.description[langId],
        productId: this._id,
        languageId: langId,
      });
    }
    return this;
  }

  async update() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.product.update(
      { productId: this._id },
      {
        ...this.data,
        productId: this._id,
      }
    );
    const langIds = Object.keys(this.description).map(Number);
    for (const langId of langIds) {
      await this.model.product.description.update(
        { productId: this._id, languageId: langId },
        {
          ...this.description[langId],
          productId: this._id,
          languageId: langId,
        }
      );
    }
    return this;
  }

  async delete() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.product.delete({ productId: this._id });
    await this.model.product.description.delete({ productId: this._id });
    await this.model.product.attribute.delete({ productId: this._id });
    await this.model.product.special.delete({ productId: this._id });
    await this.model.product.image.delete({ productId: this._id });
    this._id = undefined;
    return this;
  }

  async toCategory(category: Category, isMain: boolean = false) {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    if (!isInteger(category.id))
      throw new Error(errors.NOT_SPECIFIED("category.id"));

    await this.model.product.toCategory(this._id, category.id, isMain ? 1 : 0);
    return this;
  }

  async setAttribute(attribute: Attribute, data: Partial<TProductAttribute>) {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    if (!isInteger(attribute.id))
      throw new Error(errors.NOT_SPECIFIED("attribute.id"));

    await this.model.product.attribute.insert({
      productId: this._id,
      attributeId: attribute.id,
      languageId: data.languageId,
      text: data.text,
    });
    return this;
  }
}
