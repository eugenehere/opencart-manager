import { initialOptionValueDescription } from "../../initial";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import type { TOptionValueDescription } from "../../types/option";
import { toFieldset } from "../../utils";

export default class OptionValueDescriptionModel
  implements IModel<TOptionValueDescription> {
  constructor(private database: IDatabase) {}

  private table: string = "option_value_description";

  async select(criteria: Partial<TOptionValueDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TOptionValueDescription>) {
    const dataFieldset = toFieldset({
      ...initialOptionValueDescription,
      ...data,
    });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TOptionValueDescription>,
    data: Partial<TOptionValueDescription>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TOptionValueDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
