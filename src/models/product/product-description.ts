import { initialProductDescription } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TProductDescription } from "../../types/product";
import { toFieldset } from "../../utils";

export default class ProductDescriptionModel
  implements IModel<TProductDescription> {
  constructor(private database: IDatabase) {}

  private table: string = "product_description";

  async select(criteria: Partial<TProductDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TProductDescription>) {
    const dataFieldset = toFieldset({ ...initialProductDescription, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TProductDescription>,
    data: Partial<TProductDescription>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TProductDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
