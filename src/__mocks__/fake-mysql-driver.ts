import { TFieldset } from "../types";

export const fakeResultSetHeader = {
  fieldCount: 0,
  affectedRows: 1,
  insertId: -1,
  info: "",
  serverStatus: undefined,
  warningStatus: undefined,
};

class Actions {
  [K: string]: any; // table names

  select(table: string, criteria: TFieldset<any> = {}) {
    let rows = this[table];
    if (!Array.isArray(rows)) throw new Error(`Table ${table} doesn't exists`);
    Object.keys(criteria).forEach((key) => {
      rows = rows.filter((row: any) => row[key] === criteria[key]);
    });
    return rows;
  }

  insert(table: string, data: TFieldset<any>) {
    let insertId;
    if (Array.isArray(this[table])) {
      insertId = this[table].push(data) - 1;
      this[table][insertId][`${table}_id`] = insertId;
    } else {
      this[table] = [];
      insertId = 0;
      this[table][insertId] = {
        ...data,
        [`${table}_id`]: insertId,
      };
    }
    return {
      ...fakeResultSetHeader,
      insertId,
    };
  }

  update(table: string, criteria: TFieldset<any> = {}, data: TFieldset<any>) {
    const rows = this.select(table, criteria);
    rows.forEach((row) => {
      const rowId = row[`${table}_id`];
      this[table][rowId] = { ...row, ...data };
    });
    return {
      ...fakeResultSetHeader,
      affectedRows: rows.length,
    };
  }

  delete(table: string, criteria: TFieldset<any> = {}) {
    const rows = this.select(table, criteria);
    let affectedRows = 0;
    Object.keys(rows).forEach((key: any) => {
      const row = rows[key];
      const rowId = row[`${table}_id`];
      delete this[table][rowId];
      affectedRows += 1;
    });
    return {
      ...fakeResultSetHeader,
      affectedRows,
    };
  }

  import() {
    return this;
  }
}

export default Object.setPrototypeOf({}, new Actions());
