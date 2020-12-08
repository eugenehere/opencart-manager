import { initialAttributeGroupDescription } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TAttributeGroupDescription } from "../../types";
import { toFieldset } from "../../utils";

export default class AttributeGroupDescriptionModel
  implements IModel<TAttributeGroupDescription> {
  constructor(private database: IDatabase) {}

  private table: string = "attribute_group_description";

  async select(criteria: Partial<TAttributeGroupDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TAttributeGroupDescription>) {
    const dataFieldset = toFieldset({
      ...initialAttributeGroupDescription,
      ...data,
    });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TAttributeGroupDescription>,
    data: Partial<TAttributeGroupDescription>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TAttributeGroupDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
