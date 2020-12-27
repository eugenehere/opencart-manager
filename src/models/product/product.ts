import { initialProduct } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import type { TProduct } from "../../types/product";
import { toFieldset } from "../../utils";
import ProductAttributeModel from "./product-attribute";
import ProductDescriptionModel from "./product-description";
import ProductOptionModel from "./product-option";
import ProductSpecialModel from "./product-special";

export default class ProductModel implements IModel<TProduct> {
  constructor(private database: IDatabase) {}

  private table: string = "product";

  public description = new ProductDescriptionModel(this.database);

  public option = new ProductOptionModel(this.database);

  public attribute = new ProductAttributeModel(this.database);

  public special = new ProductSpecialModel(this.database);

  async select(criteria: Partial<TProduct>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TProduct>) {
    const dataFieldset = toFieldset({ ...initialProduct, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(criteria: Partial<TProduct>, data: Partial<TProduct>) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TProduct>) {
    const criteriaFieldset = toFieldset(criteria);
    const { productId } = criteriaFieldset;
    if (productId) {
      this.database.delete(`${this.table}_to_category`, { productId });
      this.database.delete(`${this.table}_to_store`, { productId });
    }
    return this.database.delete(this.table, criteriaFieldset);
  }

  async toCategory(
    productId: number,
    categoryId: number,
    mainCategory: number = 0
  ) {
    const fieldset = toFieldset({ productId, categoryId, mainCategory });
    return this.database.insert(`${this.table}_to_category`, fieldset);
  }

  async toStore(productId: number, storeId: number) {
    const criteria = toFieldset({ productId, storeId });
    return this.database.insert(`${this.table}_to_store`, criteria);
  }
}
