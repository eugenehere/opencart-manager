import { initialCategory } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TCategory } from "../../types/category";
import { toFieldset } from "../../utils";
import CategoryDescriptionModel from "./category-description";
import CategoryPathModel from "./category-path";

// import type

export default class CategoryModel implements IModel<TCategory> {
  constructor(private database: IDatabase) {}

  private table: string = "category";

  public description = new CategoryDescriptionModel(this.database);

  public path = new CategoryPathModel(this.database);

  async select(criteria: Partial<TCategory>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TCategory>) {
    const dataFieldset = toFieldset({ ...initialCategory, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(criteria: Partial<TCategory>, data: Partial<TCategory>) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TCategory>) {
    const criteriaFieldset = toFieldset(criteria);
    const { categoryId } = criteriaFieldset;
    if (categoryId) {
      this.database.delete(`${this.table}_to_store`, { categoryId });
      this.database.delete(`${this.table}_to_layout`, { categoryId });
    }
    return this.database.delete(this.table, criteriaFieldset);
  }

  async toStore(categoryId: number, storeId: number) {
    return this.database.insert(`${this.table}_to_store`, {
      categoryId,
      storeId,
    });
  }

  async toLayout(categoryId: number, storeId: number, layoutId: number) {
    return this.database.insert(`${this.table}_to_layout`, {
      categoryId,
      storeId,
      layoutId,
    });
  }
}
