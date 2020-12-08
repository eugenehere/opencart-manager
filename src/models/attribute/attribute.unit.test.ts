import FakeDatabase from "../../__mocks__/database";
import { initialAttribute } from "../../initial";
import { toFieldset } from "../../utils";
import AttributeModel from "./attribute";

const fakeDatabase = new FakeDatabase();
const model = new AttributeModel(fakeDatabase);

let id: number;
const table: string = "attribute";
const data = { sortOrder: 0 };
const updated = { ...data, sortOrder: 1 };
const criteria = { attributeId: -1 };
const initialValues = initialAttribute;

test("insert", async () => {
  const result = await model.insert(data);
  expect(result).toBeResponseHeaders();
  criteria.attributeId = id = result.insertId;
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
