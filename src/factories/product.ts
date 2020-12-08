import Product from "../entities/product";
import IFactory from "../interfaces/factory";
import type Model from "../model";
import { TProduct } from "../types";
import ProductOptionFactory from "./product-option";

export default class ProductFactory implements IFactory<Product> {
  constructor(private model: Model) {}

  public option = new ProductOptionFactory(this.model);

  create() {
    return new Product(this.model);
  }

  async extract(criteria: Partial<TProduct>) {
    const rowsData = await this.model.product.select(criteria);
    return this.createEntityFromRowData(rowsData[0]);
  }

  async extractAll(criteria: Partial<TProduct>) {
    const rowsData = await this.model.product.select(criteria);
    const entities: Product[] = [];
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

    const descriptionRowData = await this.model.product.description.select({
      productId,
    });

    const entity = new Product(this.model, productId);

    entity.setData({
      model: rowData.model,
      sku: rowData.sku,
      upc: rowData.upc,
      ean: rowData.ean,
      jan: rowData.jan,
      isbn: rowData.isbn,
      mpn: rowData.mpn,
      location: rowData.location,
      quantity: rowData.quantity,
      stockStatusId: rowData.stockStatusId,
      image: rowData.image,
      manufacturerId: rowData.manufacturerId,
      shipping: rowData.shipping,
      price: rowData.price,
      points: rowData.points,
      taxClassId: rowData.taxClassId,
      dateAvailable: rowData.dateAvailable,
      weight: rowData.weight,
      weightClassId: rowData.weightClassId,
      length: rowData.length,
      width: rowData.width,
      height: rowData.height,
      lengthClassId: rowData.lengthClassId,
      subtract: rowData.subtract,
      minimum: rowData.minimum,
      sortOrder: rowData.sortOrder,
      status: rowData.status,
      viewed: rowData.viewed,
      dateAdded: rowData.dateAdded,
      dateModified: rowData.dateModified,
    });

    descriptionRowData.forEach((row) => {
      entity.setDescription({
        languageId: row.languageId,
        name: row.name,
        description: row.description,
        tag: row.tag,
        metaTitle: row.metaTitle,
        metaH1: row.metaH1,
        metaDescription: row.metaDescription,
        metaKeyword: row.metaKeyword,
      });
    });

    return entity;
  }
}
