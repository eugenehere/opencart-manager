import { initialProductAttribute } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TProductAttribute } from "../../types";
import { toFieldset } from "../../utils";

export default class ProductAttributeModel
  implements IModel<TProductAttribute> {
  constructor(private database: IDatabase) {}

  private table: string = "product_attribute";

  async select(criteria: Partial<TProductAttribute>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TProductAttribute>) {
    const dataFieldset = toFieldset({ ...initialProductAttribute, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TProductAttribute>,
    data: Partial<TProductAttribute>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dateFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dateFieldset);
  }

  async delete(criteria: Partial<TProductAttribute>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
