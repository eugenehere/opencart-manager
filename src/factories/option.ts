import Option from "../entities/option";
import IFactory from "../interfaces/factory";
import type Model from "../model";
import { TOption } from "../types";
import OptionValueFactory from "./option-value";

export default class OptionFactory implements IFactory<Option> {
  constructor(private model: Model) {}

  public value = new OptionValueFactory(this.model);

  create() {
    return new Option(this.model);
  }

  async extract(criteria: Partial<TOption>) {
    const rowsData = await this.model.option.select(criteria);
    return this.createEntityFromRowData(rowsData[0]);
  }

  async extractAll(criteria: Partial<TOption>) {
    const rowsData = await this.model.option.select(criteria);
    const entities: Option[] = [];
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

    const { optionId } = rowData;

    const descriptionRowData = await this.model.option.description.select({
      optionId,
    });

    const entity = new Option(this.model, optionId);

    entity.setData({
      type: rowData.type,
      sortOrder: rowData.sortOrder,
    });

    descriptionRowData.forEach((row) => {
      entity.setDescription({
        languageId: row.languageId,
        name: row.name,
      });
    });

    return entity;
  }
}
