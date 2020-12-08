import { initialAttributeGroup } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TAttributeGroup } from "../../types";
import { toFieldset } from "../../utils";
import AttributeGroupDescriptionModel from "./attribute-group-description";

export default class AttributeGroupModel implements IModel<TAttributeGroup> {
  constructor(private database: IDatabase) {}

  private table: string = "attribute_group";

  public description = new AttributeGroupDescriptionModel(this.database);

  async select(criteria: Partial<TAttributeGroup>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TAttributeGroup>) {
    const dataFieldset = toFieldset({ ...initialAttributeGroup, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TAttributeGroup>,
    data: Partial<TAttributeGroup>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TAttributeGroup>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
