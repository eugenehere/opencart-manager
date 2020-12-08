import { initialOptionValue } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import type { TOptionValue } from "../../types/option";
import { toFieldset } from "../../utils";
import OptionValueDescriptionModel from "./option-value-description";

export default class OptionValueModel implements IModel<TOptionValue> {
  constructor(private database: IDatabase) {}

  private table: string = "option_value";

  public description = new OptionValueDescriptionModel(this.database);

  async select(criteria: Partial<TOptionValue>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TOptionValue>) {
    const dataFieldset = toFieldset({ ...initialOptionValue, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(criteria: Partial<TOptionValue>, data: Partial<TOptionValue>) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TOptionValue>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
