import { initialCategoryPath } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TCategoryPath } from "../../types/category";
import { toFieldset } from "../../utils";

export default class CategoryPathModel implements IModel<TCategoryPath> {
  constructor(private database: IDatabase) {}

  private table: string = "category_path";

  async select(criteria: Partial<TCategoryPath>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TCategoryPath>) {
    const dataFieldset = toFieldset({ ...initialCategoryPath, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(criteria: Partial<TCategoryPath>, data: Partial<TCategoryPath>) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TCategoryPath>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
