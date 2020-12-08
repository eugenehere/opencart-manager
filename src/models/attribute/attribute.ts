import { initialAttribute } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TAttribute } from "../../types";
import { toFieldset } from "../../utils";
import AttributeDescriptionModel from "./attribute-description";
import AttributeGroupModel from "./attribute-group";

export default class AttributeModel implements IModel<TAttribute> {
  constructor(private database: IDatabase) {}

  private table: string = "attribute";

  public group = new AttributeGroupModel(this.database);

  public description = new AttributeDescriptionModel(this.database);

  async select(criteria: Partial<TAttribute>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TAttribute>) {
    const dataFieldset = toFieldset({ ...initialAttribute, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(criteria: Partial<TAttribute>, data: Partial<TAttribute>) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TAttribute>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
