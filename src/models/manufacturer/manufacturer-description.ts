import { initialManufacturerDescription } from "../../initial/manufacturer";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TManufacturerDescription } from "../../types/manufacturer";
import { toFieldset } from "../../utils";

export default class ManufacturerDescriptionModel
  implements IModel<TManufacturerDescription> {
  constructor(private database: IDatabase) {}

  private table: string = "manufacturer_description";

  async select(criteria: Partial<TManufacturerDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TManufacturerDescription>) {
    const dataFieldset = toFieldset({
      ...initialManufacturerDescription,
      ...data,
    });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(
    criteria: Partial<TManufacturerDescription>,
    data: Partial<TManufacturerDescription>
  ) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TManufacturerDescription>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }
}
