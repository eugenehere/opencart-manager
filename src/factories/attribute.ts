import Attribute from "../entities/attribute";
import AttributeGroup from "../entities/attribute-group";
import errors from "../errors";
import IFactory from "../interfaces/factory";
import type Model from "../model";
import { TAttribute } from "../types";
import { isInteger } from "../utils";
import AttributeGroupFactory from "./attribute-group";

export default class AttributeFactory implements IFactory<Attribute> {
  constructor(private model: Model) {}

  public group = new AttributeGroupFactory(this.model);

  create(attributeGroup: AttributeGroup) {
    if (!isInteger(attributeGroup?.id))
      throw new Error(errors.NOT_SPECIFIED("attributeGroup.id"));

    return new Attribute(this.model, attributeGroup.id);
  }

  async extract(criteria: Partial<TAttribute>) {
    const rowsData = await this.model.attribute.select(criteria);
    return this.createEntityFromRowData(rowsData[0]);
  }

  async extractAll(criteria: Partial<TAttribute>) {
    const rowsData = await this.model.attribute.select(criteria);
    const entities: Attribute[] = [];
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
    const { attributeId } = rowData;
    const { attributeGroupId } = rowData;
    const entity = new Attribute(this.model, attributeGroupId, attributeId);
    entity.setData({ sortOrder: rowData.sortOrder });
    const descriptionRowData = await this.model.attribute.description.select({
      attributeId,
    });
    descriptionRowData.forEach((description) => {
      entity.setDescription({
        languageId: description.languageId,
        name: description.name,
      });
    });
    return entity;
  }
}
