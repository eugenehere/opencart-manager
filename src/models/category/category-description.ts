import { initialCategoryDescription } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TCategoryDescription } from "../../types/category";
import { toFieldset } from "../../utils";

export default class CategoryDescriptionModel
  implements IModel<TCategoryDescription> {
  constructor(private database: IDatabase) {}

  private table: string = "category_description";

  async select(criteria: Partial<TCategoryDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TCategoryDescription>) {
    const dataFieldset = toFieldset({ ...initialCategoryDescription, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TCategoryDescription>,
    data: Partial<TCategoryDescription>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TCategoryDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
