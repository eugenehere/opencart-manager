import { snakeCase } from "change-case";

import IDatabase from "../interfaces/database";
import { TFieldset } from "../types";
import {
  PromisifyDelay,
  camelCasePropertyNames,
  snakeCasePropertyNames,
} from "../utils";
import fakeMysqlDriver from "./fake-mysql-driver";

export default class Database implements IDatabase {
  prefix = "oc_";

  queryResponseDelay = 0;

  mocks = {
    select: jest.fn(),
    insert: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    close: jest.fn(),
  };

  select<T>(table: string, criteria: TFieldset<T>) {
    this.mocks.select(table, criteria);
    const rows = fakeMysqlDriver.select(
      table,
      snakeCasePropertyNames(criteria)
    );
    const response = rows.map((row: any) => camelCasePropertyNames(row));
    return PromisifyDelay(response, this.queryResponseDelay);
  }

  insert<T>(table: string, fieldset: TFieldset<T>) {
    this.mocks.insert(table, fieldset);
    const response = fakeMysqlDriver.insert(
      table,
      snakeCasePropertyNames(fieldset)
    );
    return PromisifyDelay(response, this.queryResponseDelay);
  }

  update<T>(table: string, criteria: TFieldset<T>, fieldset: TFieldset<T>) {
    this.mocks.update(table, criteria, fieldset);
    const response = fakeMysqlDriver.update(
      table,
      snakeCasePropertyNames(criteria),
      snakeCasePropertyNames(fieldset)
    );
    return PromisifyDelay(response, this.queryResponseDelay);
  }

  delete<T>(table: string, criteria: TFieldset<T>) {
    this.mocks.delete(table, criteria);
    const response = fakeMysqlDriver.delete(
      table,
      snakeCasePropertyNames(criteria)
    );
    return PromisifyDelay(response, this.queryResponseDelay);
  }

  close() {
    this.mocks.close();
    snakeCase;
  }

  static import() {
    return fakeMysqlDriver.import();
  }
}
