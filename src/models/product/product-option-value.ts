import { initialProductOptionValue } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TProductOptionValue } from "../../types/product";
import { toFieldset } from "../../utils";

export default class ProductOptionValueModel
  implements IModel<TProductOptionValue> {
  constructor(private database: IDatabase) {}

  private table: string = "product_option_value";

  async select(criteria: Partial<TProductOptionValue>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TProductOptionValue>) {
    const dataFieldset = toFieldset({ ...initialProductOptionValue, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TProductOptionValue>,
    data: Partial<TProductOptionValue>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TProductOptionValue>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
