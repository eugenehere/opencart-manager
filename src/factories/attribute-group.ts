import AttributeGroup from "../entities/attribute-group";
import IFactory from "../interfaces/factory";
import type Model from "../model";
import { TAttributeGroup } from "../types";

export default class AttributeGroupFactory implements IFactory<AttributeGroup> {
  constructor(private model: Model) {}

  create() {
    return new AttributeGroup(this.model);
  }

  async extract(criteria: Partial<TAttributeGroup>) {
    const rowsData = await this.model.attribute.group.select(criteria);
    return this.createEntityFromRowData(rowsData[0]);
  }

  async extractAll(criteria: Partial<TAttributeGroup>) {
    const rowsData = await this.model.attribute.group.select(criteria);
    const entities: AttributeGroup[] = [];
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
    const { attributeGroupId } = rowData;

    const descriptionRowData = await this.model.attribute.group.description.select(
      {
        attributeGroupId,
      }
    );

    const entity = new AttributeGroup(this.model, attributeGroupId);

    entity.setData({ sortOrder: rowData.sortOrder });

    descriptionRowData.forEach((desription) => {
      entity.setDescription({
        languageId: desription.languageId,
        name: desription.name,
      });
    });

    return entity;
  }
}
