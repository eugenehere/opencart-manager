import FakeDatabase from "../../__mocks__/database";
import { initialManufacturer } from "../../initial";
import { toFieldset } from "../../utils";
import ManufacturerModel from "./manufacturer";

const fakeDatabase = new FakeDatabase();
const model = new ManufacturerModel(fakeDatabase);

let id: number;
const table: string = "manufacturer";
const data = { name: "Test Manuf" };
const updated = { ...data, name: "Test Manuf updated" };
const criteria = { manufacturerId: -1 };
const initialValues = initialManufacturer;

test("insert", async () => {
  const result = await model.insert(data);
  expect(result).toBeResponseHeaders();
  criteria.manufacturerId = id = result.insertId;
  expect(fakeDatabase.mocks.insert).toHaveBeenNthCalledWith(
    1,
    table,
    toFieldset({ ...initialValues, ...data })
  );
});

test("select", async () => {
  const rows = await model.select(criteria);
  expect(fakeDatabase.mocks.select).toHaveBeenNthCalledWith(1, table, criteria);
  expect(rows[0]).toStrictEqual(
    expect.objectContaining(
      toFieldset({
        ...initialValues,
        ...data,
      })
    )
  );
});

test("update", async () => {
  const result = await model.update(criteria, updated);
  expect(fakeDatabase.mocks.update).toHaveBeenNthCalledWith(
    1,
    table,
    criteria,
    toFieldset(updated)
  );
  expect(result).toBeResponseHeaders();
});

test("delete", async () => {
  const result = await model.delete(criteria);
  expect(fakeDatabase.mocks.delete).toHaveBeenNthCalledWith(1, table, criteria);
  expect(result).toBeResponseHeaders();
});

test("toStore", async () => {
  const result = await model.toStore(id, 1);
  expect(fakeDatabase.mocks.insert).toHaveBeenNthCalledWith(
    2,
    table + "_to_store",
    { manufacturerId: id, storeId: 1 }
  );
  expect(result).toBeResponseHeaders();
});
