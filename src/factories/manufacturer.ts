import Manufacturer from "../entities/manufacturer";
import IFactory from "../interfaces/factory";
import type Model from "../model";
import { TManufacturer } from "../types";

export default class ManufacturerFactory implements IFactory<Manufacturer> {
  constructor(private model: Model) {}

  create() {
    return new Manufacturer(this.model);
  }

  async extract(criteria: Partial<TManufacturer>) {
    const rowsData = await this.model.manufacturer.select(criteria);
    return this.createEntityFromRowData(rowsData[0]);
  }

  async extractAll(criteria: Partial<TManufacturer>) {
    const rowsData = await this.model.manufacturer.select(criteria);
    const entities: Manufacturer[] = [];
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

    const { manufacturerId } = rowData;

    const descriptionRowData = await this.model.manufacturer.description.select(
      { manufacturerId }
    );

    const entity = new Manufacturer(this.model, manufacturerId);

    entity.setData({
      name: rowData.name,
      image: rowData.image,
      sortOrder: rowData.sortOrder,
    });

    descriptionRowData.forEach((row) => {
      entity.setDescription({
        languageId: row.languageId,
        manufacturerId: row.manufacturerId,
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
