import { initialProductImage } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TProductImage } from "../../types/product";
import { toFieldset } from "../../utils";

export default class ProductImageModel implements IModel<TProductImage> {
  constructor(private database: IDatabase) {}

  private table: string = "product_image";

  async select(criteria: Partial<TProductImage>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TProductImage>) {
    const dataFieldset = toFieldset({ ...initialProductImage, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(criteria: Partial<TProductImage>, data: Partial<TProductImage>) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TProductImage>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
