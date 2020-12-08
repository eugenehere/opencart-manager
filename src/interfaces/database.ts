import { TFieldset, TResponseHeaders } from "../types";

export default interface IDatabase {
  select(table: string, criteria: TFieldset<any>): Promise<any[]>;
  insert(table: string, fieldset: TFieldset<any>): Promise<TResponseHeaders>;
  update(
    table: string,
    criteria: TFieldset<any>,
    fieldset: TFieldset<any>
  ): Promise<TResponseHeaders>;
  delete(table: string, criteria: TFieldset<any>): Promise<TResponseHeaders>;
  close(): void;
}
