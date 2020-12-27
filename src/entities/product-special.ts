import errors from "../errors";
import IEntity from "../interfaces/entity";
import type Model from "../model";
import { TProductSpecial } from "../types/product";
import { isInteger } from "../utils";

export default class ProductSpecial implements IEntity {
  constructor(
    private model: Model,
    private productId: number,
    private _id?: number
  ) {}

  public data: Partial<TProductSpecial> = {};

  get id(): number | undefined {
    return this._id;
  }

  setData(newData: Partial<TProductSpecial>) {
    this.data = { ...this.data, ...newData };
    return this;
  }

  async insert() {
    if (isInteger(this._id)) throw new Error(errors.ENTITY_INSERTED);

    const { insertId } = await this.model.product.special.insert({
      ...this.data,
      productId: this.productId,
    });

    this._id = insertId;
    return this;
  }

  async update() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);

    await this.model.product.special.update(
      { productSpecialId: this._id },
      {
        ...this.data,
        productSpecialId: this._id,
        productId: this.productId,
      }
    );
    return this;
  }

  async delete() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.product.special.delete({
      productSpecialId: this._id,
    });
    this._id = undefined;
    return this;
  }
}
