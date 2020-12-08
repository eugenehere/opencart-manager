import { initialAttributeDescription } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TAttributeDescription } from "../../types";
import { toFieldset } from "../../utils";

export default class AttributeDescriptionModel
  implements IModel<TAttributeDescription> {
  constructor(private database: IDatabase) {}

  private table: string = "attribute_description";

  async select(criteria: Partial<TAttributeDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TAttributeDescription>) {
    const dataFieldset = toFieldset({
      ...initialAttributeDescription,
      ...data,
    });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TAttributeDescription>,
    data: Partial<TAttributeDescription>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TAttributeDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
