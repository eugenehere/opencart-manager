import errors from "../errors";
import IModel from "../interfaces/model";

export default class FakeEntity {
  constructor(private model: IModel<any>, ...rest: number[]) {}

  data: any = {};
  description: any = {};

  setData(newData: object): this {
    this.data = { ...this.data, ...newData };
    return this;
  }

  setDescription(newDesc: any): this {
    if (!newDesc.languageId)
      throw new Error(errors.NOT_SPECIFIED("newDesc.languageId"));
    const langId = newDesc.languageId;
    this.description[langId] = { ...this.description[langId], ...newDesc };
    return this;
  }
}
