import Product from "../entities/product";
import ProductImage from "../entities/product-image";
import ProductSpecial from "../entities/product-special";
import errors from "../errors";
import IFactory from "../interfaces/factory";
import type Model from "../model";
import { TProductImage } from "../types";
import { isInteger } from "../utils";

export default class ProductImageFactory implements IFactory<ProductImage> {
  constructor(private model: Model) {}

  create(product: Product) {
    if (!isInteger(product?.id))
      throw new Error(errors.NOT_SPECIFIED("product.id"));
    return new ProductImage(this.model, product.id);
  }

  async extract(criteria: Partial<TProductImage>) {
    const rowsData = await this.model.product.image.select(criteria);
    return this.createEntityFromRowData(rowsData[0]);
  }

  async extractAll(criteria: Partial<TProductImage>) {
    const rowsData = await this.model.product.image.select(criteria);
    const entities: ProductImage[] = [];
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

    const entity = new ProductImage(this.model, productId);

    entity.setData({
      productId: rowData.productId,
      image: rowData.image,
      sortOrder: rowData.sortOrder,
    });

    return entity;
  }
}
