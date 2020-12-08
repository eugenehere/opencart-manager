import Option from "../entities/option";
import OptionValue from "../entities/option-value";
import errors from "../errors";
import IFactory from "../interfaces/factory";
import type Model from "../model";
import { TOptionValue } from "../types";
import { isInteger } from "../utils";

export default class OptionValueFactory implements IFactory<OptionValue> {
  constructor(private model: Model) {}

  create(option: Option) {
    if (!isInteger(option?.id))
      throw new Error(errors.NOT_SPECIFIED("option.id"));
    return new OptionValue(this.model, option.id);
  }

  async extract(criteria: Partial<TOptionValue>) {
    const rowsData = await this.model.option.value.select(criteria);
    return this.createEntityFromRowData(rowsData[0]);
  }

  async extractAll(criteria: Partial<TOptionValue>) {
    const rowsData = await this.model.option.value.select(criteria);
    const entities: OptionValue[] = [];
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

    const { optionId, optionValueId } = rowData;

    const descriptionRowData = await this.model.option.value.description.select(
      {
        optionValueId,
      }
    );

    const entity = new OptionValue(this.model, optionId, optionValueId);

    entity.setData({
      optionId: optionId,
      image: rowData.image,
      sortOrder: rowData.sortOrder,
    });

    descriptionRowData.forEach((row) => {
      entity.setDescription({
        languageId: row.languageId,
        optionValueId: optionValueId,
        optionId: optionId,
        name: row.name,
      });
    });

    return entity;
  }
}
