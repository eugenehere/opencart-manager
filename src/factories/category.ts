import Category from "../entities/category";
import IFactory from "../interfaces/factory";
import type Model from "../model";
import { TCategory } from "../types";

export default class CategoryFactory implements IFactory<Category> {
  constructor(private model: Model) {}

  create() {
    return new Category(this.model);
  }

  async extract(criteria: Partial<TCategory>) {
    const rowsData = await this.model.category.select(criteria);
    return this.createEntityFromRowData(rowsData[0]);
  }

  async extractAll(criteria: Partial<TCategory>) {
    const rowsData = await this.model.category.select(criteria);
    const entities: Category[] = [];
    for (const rowData of rowsData) {
      const entity = await this.createEntityFromRowData(rowData);
      if (entity) {
        entities.push(entity);
      }
    }
    return entities;
  }

  private async createEntityFromRowData(rowData: any) {
    if (!rowData) return undefined;

    const { categoryId } = rowData;

    const descriptionRowData = await this.model.category.description.select({
      categoryId,
    });

    const entity = new Category(this.model, categoryId);

    entity.setData({
      image: rowData.image,
      parentId: rowData.parentId,
      top: rowData.top,
      column: rowData.column,
      sortOrder: rowData.sortOrder,
      status: rowData.status,
      dateAdded: rowData.dateAdded,
      dateModified: rowData.dateModified,
    });

    descriptionRowData.forEach((row) => {
      entity.setDescription({
        languageId: row.languageId,
        categoryId: row.categoryId,
        name: row.name,
        description: row.description,
        metaTitle: row.metaTitle,
        metaH1: row.metaH1,
        metaDescription: row.metaDescription,
        metaKeyword: row.metaKeyword,
      });
    });

    return entity;
  }
}
