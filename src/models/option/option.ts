import { initialOption } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import type { TOption } from "../../types/option";
import { toFieldset } from "../../utils";
import OptionDescriptionModel from "./option-description";
import OptionValueModel from "./option-value";

export default class OptionModel implements IModel<TOption> {
  constructor(private database: IDatabase) {}

  private table: string = "option";

  public description = new OptionDescriptionModel(this.database);

  public value = new OptionValueModel(this.database);

  async select(criteria: Partial<TOption>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TOption>) {
    const dataFieldset = toFieldset({ ...initialOption, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(criteria: Partial<TOption>, data: Partial<TOption>) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TOption>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
