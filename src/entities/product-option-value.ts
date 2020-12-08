import errors from "../errors";
import IEntity from "../interfaces/entity";
import type Model from "../model";
import { TProductOptionValue } from "../types/product";
import { isInteger } from "../utils";

export default class ProductOptionValue implements IEntity {
  constructor(
    private model: Model,
    private productOptionId: number,
    private optionValueId: number,
    private _id?: number
  ) {}

  public data: Partial<TProductOptionValue> = {};

  get id(): number | undefined {
    return this._id;
  }

  setData(newData: Partial<TProductOptionValue>) {
    this.data = { ...this.data, ...newData };
    return this;
  }

  async insert() {
    if (isInteger(this._id)) throw new Error(errors.ENTITY_INSERTED);

    const { productId } = (
      await this.model.product.option.select({
        productOptionId: this.productOptionId,
      })
    )[0];

    const { optionId } = (
      await this.model.option.value.select({
        optionValueId: this.optionValueId,
      })
    )[0];

    const { insertId } = await this.model.product.option.value.insert({
      ...this.data,
      productOptionId: this.productOptionId,
      productId,
      optionId,
      optionValueId: this.optionValueId,
    });

    this._id = insertId;
    return this;
  }

  async update() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);

    const { productId } = (
      await this.model.product.option.select({
        productOptionId: this.productOptionId,
      })
    )[0];

    const { optionId } = (
      await this.model.option.value.select({
        optionValueId: this.optionValueId,
      })
    )[0];

    await this.model.product.option.value.update(
      { productOptionValueId: this._id },
      {
        ...this.data,
        productOptionValueId: this._id,
        productOptionId: this.productOptionId,
        productId,
        optionId,
        optionValueId: this.optionValueId,
      }
    );
    return this;
  }

  async delete() {
    if (!isInteger(this._id)) throw new Error(errors.ENTITY_NOT_INSERTED);
    await this.model.product.option.value.delete({
      productOptionValueId: this._id,
    });
    this._id = undefined;
    return this;
  }
}
