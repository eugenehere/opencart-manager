import errors from "../errors";
import IEntity from "../interfaces/entity";
import type Model from "../model";
import { TProductOption } from "../types/product";
import { isInteger } from "../utils";

export default class ProductOption implements IEntity {
  constructor(
    private model: Model,
    private productId: number,
    private optionId: number,
    private _id?: number
  ) {}

  public data: Partial<TProductOption> = {};

  get id(): number | undefined {
    return this._id;
  }

  setData(newData: Partial<TProductOption>) {
    this.data = { ...this.data, ...newData };
    return this;
  }

  async insert() {
    if (isInteger(this._id)) throw new Error(errors.ENTITY_INSERTED);

    const { insertId } = await this.model.product.option.insert({
      ...this.data,
      productId: this.productId,
      optionId: this.optionId,
    });

    this._id = insertId;
    return this;
  }

  async update() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.product.option.update(
      { productOptionId: this._id },
      {
        ...this.data,
        productOptionId: this._id,
        productId: this.productId,
        optionId: this.optionId,
      }
    );
    return this;
  }

  async delete() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.product.option.delete({ productOptionId: this._id });
    this._id = undefined;
    return this;
  }
}
