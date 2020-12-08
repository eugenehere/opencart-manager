import OptionValue from "../entities/option-value";
import ProductOption from "../entities/product-option";
import ProductOptionValue from "../entities/product-option-value";
import errors from "../errors";
import IFactory from "../interfaces/factory";
import type Model from "../model";
import { TProductOptionValue } from "../types";
import { isInteger } from "../utils";

export default class ProductOptionValueFactory
  implements IFactory<ProductOptionValue> {
  constructor(private model: Model) {}

  create(productOption: ProductOption, optionValue: OptionValue) {
    if (!isInteger(productOption?.id))
      throw new Error(errors.NOT_SPECIFIED("productOption.id"));
    if (!isInteger(optionValue?.id))
      throw new Error(errors.NOT_SPECIFIED("optionValue.id"));
    return new ProductOptionValue(this.model, productOption.id, optionValue.id);
  }

  async extract(criteria: Partial<TProductOptionValue>) {
    const rowsData = await this.model.product.option.value.select(criteria);
    return this.createEntityFromRowData(rowsData[0]);
  }

  async extractAll(criteria: Partial<TProductOptionValue>) {
    const rowsData = await this.model.product.option.value.select(criteria);
    const entities: ProductOptionValue[] = [];
    for (const rowData of rowsData) {
      const entity = await this.createEntityFromRowData(rowData);
      if (entity) {
        entities.push(entity);
      }
    }
    return entities;
  }

  private async createEntityFromRowData(rowData: any) {
    if (!rowData) return undefined;

    const { productOptionValueId, productOptionId, optionValueId } = rowData;

    const entity = new ProductOptionValue(
      this.model,
      productOptionId,
      optionValueId,
      productOptionValueId
    );

    entity.setData({
      quantity: rowData.quantity,
      subtract: rowData.subtract,
      price: rowData.price,
      pricePrefix: rowData.pricePrefix,
      points: rowData.points,
      pointsPrefix: rowData.pointsPrefix,
      weight: rowData.weight,
      weightPrefix: rowData.weightPrefix,
    });

    return entity;
  }
}
