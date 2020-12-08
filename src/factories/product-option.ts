import Option from "../entities/option";
import Product from "../entities/product";
import ProductOption from "../entities/product-option";
import errors from "../errors";
import IFactory from "../interfaces/factory";
import type Model from "../model";
import { TProductOption } from "../types";
import { isInteger } from "../utils";
import ProductOptionValueFactory from "./product-option-value";

export default class ProductOptionFactory implements IFactory<ProductOption> {
  constructor(private model: Model) {}

  public value = new ProductOptionValueFactory(this.model);

  create(product: Product, option: Option) {
    if (!isInteger(product?.id))
      throw new Error(errors.NOT_SPECIFIED("product.id"));
    if (!isInteger(option?.id))
      throw new Error(errors.NOT_SPECIFIED("option.id"));
    return new ProductOption(this.model, product.id, option.id);
  }

  async extract(criteria: Partial<TProductOption>) {
    const rowsData = await this.model.product.option.select(criteria);
    return this.createEntityFromRowData(rowsData[0]);
  }

  async extractAll(criteria: Partial<TProductOption>) {
    const rowsData = await this.model.product.option.select(criteria);
    const entities: ProductOption[] = [];
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

    const { productId, optionId, productOptionId } = rowData;

    const entity = new ProductOption(
      this.model,
      productId,
      optionId,
      productOptionId
    );

    entity.setData({
      required: rowData.required,
      value: rowData.value,
    });

    return entity;
  }
}
