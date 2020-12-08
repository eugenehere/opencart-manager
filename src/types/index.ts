import type mysql from "mysql2/promise";

export * from "./product";
export * from "./category";
export * from "./option";
export * from "./attribute";
export * from "./manufacturer";

export type TConfiguration = {
  tablePrefix?: string;
};

export type TFieldset<T> = {
  [K in keyof T]: string | number;
};

export type Multilang<T> = {
  [languageId: number]: Partial<T>;
};

export type TResponseHeaders = {
  affectedRows: number;
  insertId: number;

  // fieldCount: number,
  // info: string,
  // serverStatus: number,
  // warningStatus: number
};
