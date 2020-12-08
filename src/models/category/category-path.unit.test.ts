import FakeDatabase from "../../__mocks__/database";
import { initialCategoryPath } from "../../initial";
import { toFieldset } from "../../utils";
import CategoryPathModel from "./category-path";

const fakeDatabase = new FakeDatabase();
const model = new CategoryPathModel(fakeDatabase);

const table: string = "category_path";
const data = { categoryId: 123, level: 0 };
const updated = { ...data, level: 1 };
const criteria = { categoryId: data.categoryId };
const initialValues = initialCategoryPath;

test("insert", async () => {
  const result = await model.insert(data);
  expect(result).toBeResponseHeaders();
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
