import FakeDatabase from "../../__mocks__/database";
import { initialProduct } from "../../initial";
import { toFieldset } from "../../utils";
import ProductModel from "./product";

const fakeDatabase = new FakeDatabase();
const model = new ProductModel(fakeDatabase);

let id: number;
const table: string = "product";
const data = { price: 123 };
const updated = { ...data, price: 234 };
const criteria = { productId: -1 };
const initialValues = initialProduct;

test("insert", async () => {
  const result = await model.insert(data);
  expect(result).toBeResponseHeaders();
  criteria.productId = id = result.insertId;
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

test("toCategory", async () => {
  const result = await model.toCategory(id!, 123, 0);
  expect(fakeDatabase.mocks.insert).toHaveBeenNthCalledWith(
    2,
    table + "_to_category",
    {
      productId: id,
      categoryId: 123,
      mainCategory: 0,
    }
  );
  expect(result).toBeResponseHeaders();
});

test("toStore", async () => {
  const result = await model.toStore(id!, 1);
  expect(fakeDatabase.mocks.insert).toHaveBeenNthCalledWith(
    3,
    table + "_to_store",
    {
      productId: id,
      storeId: 1,
    }
  );
  expect(result).toBeResponseHeaders();
});
