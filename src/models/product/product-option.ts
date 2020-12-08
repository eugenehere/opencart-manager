import { initialProductOption } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TProductOption } from "../../types/product";
import { toFieldset } from "../../utils";
import ProductOptionValueModel from "./product-option-value";

export default class ProductOptionModel implements IModel<TProductOption> {
  constructor(private database: IDatabase) {}

  private table: string = "product_option";

  public value = new ProductOptionValueModel(this.database);

  async select(criteria: Partial<TProductOption>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TProductOption>) {
    const dataFieldset = toFieldset({ ...initialProductOption, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TProductOption>,
    data: Partial<TProductOption>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TProductOption>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
