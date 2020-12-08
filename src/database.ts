import type mysql from "mysql2/promise";

import errors from "./errors";
import IDatabase from "./interfaces/database";
import { TFieldset, TResponseHeaders } from "./types";
import { camelCasePropertyNames, snakeCasePropertyNames } from "./utils";

export default class Database implements IDatabase {
  constructor(
    private connection: mysql.Connection,
    private prefix: string = "oc_"
  ) {}

  async select(table: string, criteria: TFieldset<any>) {
    const criteriaSnakeCase = snakeCasePropertyNames(
      criteria
    ) as TFieldset<any>;

    const result = await this.connection.query(`
            SELECT *
            FROM \`${this.prefix + table}\`
            WHERE ${Object.keys(criteriaSnakeCase)
              .map((key) => `\`${key}\` = '${criteriaSnakeCase[key]}'`)
              .join(" AND ")}
        `);

    return (result[0] as object[]).map((row: object) =>
      camelCasePropertyNames(row)
    );
  }

  async insert(table: string, data: TFieldset<any>) {
    const dataSnakeCase = snakeCasePropertyNames(data) as TFieldset<any>;
    const result = await this.connection.query(`
            INSERT INTO \`${this.prefix + table}\`
            (${Object.keys(dataSnakeCase)
              .map((key) => `\`${key}\``)
              .join(", ")})
            VALUES
            (${Object.keys(dataSnakeCase)
              .map((key) => `'${dataSnakeCase[key]}'`)
              .join(", ")})
        `);
    if ((result[0] as mysql.ResultSetHeader).affectedRows === 0) {
      throw new Error(errors.NO_AFFECTED_ROWS);
    }
    return result[0] as TResponseHeaders;
  }

  async update(table: string, criteria: TFieldset<any>, data: TFieldset<any>) {
    const dataSnakeCase = snakeCasePropertyNames(data) as TFieldset<any>;
    const criteriaSnakeCase = snakeCasePropertyNames(
      criteria
    ) as TFieldset<any>;
    const result = await this.connection.query(`
            UPDATE \`${this.prefix + table}\`
            SET ${Object.keys(dataSnakeCase)
              .map((key) => `\`${key}\` = '${dataSnakeCase[key]}'`)
              .join(", ")}
            WHERE ${Object.keys(criteriaSnakeCase)
              .map((key) => `\`${key}\` = '${criteriaSnakeCase[key]}'`)
              .join(" AND ")}
        `);
    if ((result[0] as mysql.ResultSetHeader).affectedRows === 0) {
      throw new Error(errors.NO_AFFECTED_ROWS);
    }
    return result[0] as TResponseHeaders;
  }

  async delete(table: string, criteria: TFieldset<any>) {
    const criteriaSnakeCase = snakeCasePropertyNames(
      criteria
    ) as TFieldset<any>;
    const result = await this.connection.query(`
            DELETE FROM \`${this.prefix + table}\`
            WHERE ${Object.keys(criteriaSnakeCase)
              .map((key) => `\`${key}\` = '${criteriaSnakeCase[key]}'`)
              .join(" AND ")}
        `);
    return result[0] as TResponseHeaders;
  }

  close(): void {
    this.connection.destroy();
  }
}
