import FakeDatabase from "../../__mocks__/database";
import { initialProductDescription } from "../../initial";
import { toFieldset } from "../../utils";
import ProductDescriptionModel from "./product-description";

const fakeDatabase = new FakeDatabase();
const model = new ProductDescriptionModel(fakeDatabase);

const table: string = "product_description";
const data = { productId: 123, languageId: 1, name: "test name" };
const updated = { ...data, name: "test name updated" };
const criteria = { productId: data.productId };
const initialValues = initialProductDescription;

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
