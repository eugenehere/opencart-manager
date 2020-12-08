import { TResponseHeaders } from "../types";

export default interface IModel<TFields> {
  select(criteria: Partial<TFields>): Promise<object[]>;
  insert(data: Partial<TFields>): Promise<TResponseHeaders>;
  update(
    criteria: Partial<TFields>,
    data: Partial<TFields>
  ): Promise<TResponseHeaders>;
  delete(criteria: Partial<TFields>): Promise<TResponseHeaders>;
}
