import { initialProductSpecial } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TProductSpecial } from "../../types/product";
import { toFieldset } from "../../utils";

export default class ProductSpecialModel implements IModel<TProductSpecial> {
  constructor(private database: IDatabase) {}

  private table: string = "product_special";

  async select(criteria: Partial<TProductSpecial>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TProductSpecial>) {
    console.log({ data });
    
    const dataFieldset = toFieldset({ ...initialProductSpecial, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TProductSpecial>,
    data: Partial<TProductSpecial>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TProductSpecial>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
