import { initialManufacturer } from "../../initial/manufacturer";
import IDatabase from "../../interfaces/database";
import IModel from "../../interfaces/model";
import { TManufacturer } from "../../types/manufacturer";
import { toFieldset } from "../../utils";
import ManufacturerDescriptionModel from "./manufacturer-description";

export default class ManufacturerModel implements IModel<TManufacturer> {
  constructor(private database: IDatabase) {}

  private table: string = "manufacturer";

  public description = new ManufacturerDescriptionModel(this.database);

  async select(criteria: Partial<TManufacturer>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.select(this.table, criteriaFieldset);
  }

  async insert(data: Partial<TManufacturer>) {
    const dataFieldset = toFieldset({ ...initialManufacturer, ...data });
    return this.database.insert(this.table, dataFieldset);
  }

  async update(criteria: Partial<TManufacturer>, data: Partial<TManufacturer>) {
    const criteriaFieldset = toFieldset(criteria);
    const dataFieldset = toFieldset(data);
    return this.database.update(this.table, criteriaFieldset, dataFieldset);
  }

  async delete(criteria: Partial<TManufacturer>) {
    const criteriaFieldset = toFieldset(criteria);
    return this.database.delete(this.table, criteriaFieldset);
  }

  async toStore(manufacturerId: number, storeId: number) {
    return this.database.insert(`${this.table}_to_store`, {
      manufacturerId,
      storeId,
    });
  }
}
