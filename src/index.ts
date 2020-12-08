import mysql from "mysql2/promise";

import Database from "./database";
import Factory from "./factory";
import Model from "./model";
import { TConfiguration } from "./types";

export default async function opencartManager(
  credentials: mysql.ConnectionOptions,
  config?: TConfiguration
) {
  const connection = await mysql.createConnection(credentials);
  const database = new Database(connection, config?.tablePrefix);
  const model = new Model(database);
  return new Factory(model);
}
