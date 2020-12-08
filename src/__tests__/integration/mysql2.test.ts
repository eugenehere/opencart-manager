import mysql2 from "mysql2/promise";

import { testDbCredentials } from "../config";

let connection: mysql2.Connection;
let table: string = "test_table_temporary";

test("open connection", async () => {
  connection = await mysql2.createConnection(testDbCredentials);
  expect(connection.query).toBeDefined();
});

test("create test table", async () => {
  const response = await connection.query(`
        CREATE TABLE IF NOT EXISTS ${table} (
            name varchar(255),
            age int
        )
    `);
  expect(response).toBeArray();
  expect(response[0]).toBeResponseHeaders();
});

test("insert", async () => {
  const response = await connection.query(`
        INSERT INTO ${table}
        (name, age)
        VALUES
        ('john', 12)
    `);
  expect(response).toBeArray();
  expect(response[0]).toBeResponseHeaders();
});

test("select", async () => {
  const response = await connection.query(`
        SELECT *
        FROM ${table}
        WHERE name = 'john'
    `);
  expect(response).toBeArray();
  expect(response[0]).toBeArray();
  expect(response[0] as mysql2.RowDataPacket).toHaveLength(1);
  expect(response[1]).toBeArray();
});

test("update", async () => {
  const response = await connection.query(`
        UPDATE ${table}
        SET age = 22
        WHERE name = 'john'
    `);
  expect(response).toBeArray();
  expect(response[0]).toBeResponseHeaders();
  expect((response[0] as mysql2.ResultSetHeader).affectedRows).toBe(1);
});

test("delete", async () => {
  const response = await connection.query(`
        DELETE FROM ${table}
        WHERE age = '22'
    `);
  expect(response).toBeArray();
  expect(response[0]).toBeResponseHeaders();
  expect((response[0] as mysql2.ResultSetHeader).affectedRows).toBe(1);
});

test("check if empty", async () => {
  const response = await connection.query(`
        SELECT *
        FROM ${table}
    `);
  expect(response).toBeArray();
  expect(response[0]).toBeArray();
  expect(response[0] as mysql2.RowDataPacket).toHaveLength(0);
  expect(response[1]).toBeArray();
});

test("drop test table", async () => {
  const response = await connection.query(`DROP TABLE ${table}`);
  expect(response).toBeArray();
  expect(response[0]).toBeResponseHeaders();
});

test("close connection", async () => {
  connection.destroy();
});
