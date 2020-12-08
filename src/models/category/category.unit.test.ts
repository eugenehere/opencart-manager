import FakeDatabase from "../../__mocks__/database";
import { initialCategory } from "../../initial";
import { toFieldset } from "../../utils";
import CategoryModel from "./category";

const fakeDatabase = new FakeDatabase();
const model = new CategoryModel(fakeDatabase);

let id: number;
const table: string = "category";
const data = { image: "image.png" };
const updated = { ...data, image: "image2.png" };
const criteria = { categoryId: -1 };
const initialValues = initialCategory;

test("insert", async () => {
  const result = await model.insert(data);
  expect(result).toBeResponseHeaders();
  criteria.categoryId = id = result.insertId;
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
  const result = await model.toStore(id, 0);
  expect(fakeDatabase.mocks.insert).toHaveBeenNthCalledWith(
    2,
    table + "_to_store",
    { categoryId: id, storeId: 0 }
  );
  expect(result).toBeResponseHeaders();
});

test("toLayout", async () => {
  const result = await model.toLayout(id, 0, 0);
  expect(fakeDatabase.mocks.insert).toHaveBeenNthCalledWith(
    3,
    table + "_to_layout",
    { categoryId: id, layoutId: 0, storeId: 0 }
  );
  expect(result).toBeResponseHeaders();
});
