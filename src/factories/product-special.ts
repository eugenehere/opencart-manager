import Product from "../entities/product";
import ProductSpecial from "../entities/product-special";
import errors from "../errors";
import IFactory from "../interfaces/factory";
import type Model from "../model";
import { TProductSpecial } from "../types";
import { isInteger } from "../utils";

export default class ProductSpecialFactory implements IFactory<ProductSpecial> {
  constructor(private model: Model) {}

  create(product: Product) {
    if (!isInteger(product?.id))
      throw new Error(errors.NOT_SPECIFIED("product.id"));
    return new ProductSpecial(this.model, product.id);
  }

  async extract(criteria: Partial<TProductSpecial>) {
    const rowsData = await this.model.product.special.select(criteria);
    return this.createEntityFromRowData(rowsData[0]);
  }

  async extractAll(criteria: Partial<TProductSpecial>) {
    const rowsData = await this.model.product.special.select(criteria);
    const entities: ProductSpecial[] = [];
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

    const { productId } = rowData;

    const entity = new ProductSpecial(this.model, productId);

    entity.setData({
      productId: rowData.productId,
      customerGroupId: rowData.customerGroupId,
      priority: rowData.priority,
      price: rowData.price,
      dateStart: rowData.dateStart,
      dateEnd: rowData.dateEnd,
    });

    return entity;
  }
}
