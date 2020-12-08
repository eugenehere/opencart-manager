import { initialOptionDescription } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import type { TOptionDescription } from "../../types/option";
import { toFieldset } from "../../utils";

export default class OptionDescriptionModel
  implements IModel<TOptionDescription> {
  constructor(private database: IDatabase) {}

  private table: string = "option_description";

  async select(criteria: Partial<TOptionDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TOptionDescription>) {
    const dataFieldset = toFieldset({ ...initialOptionDescription, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TOptionDescription>,
    data: Partial<TOptionDescription>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TOptionDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
