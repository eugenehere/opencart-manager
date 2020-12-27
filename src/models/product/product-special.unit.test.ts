import FakeDatabase from "../../__mocks__/database";
import { initialProductSpecial } from "../../initial";
import { toFieldset } from "../../utils";
import ProductSpecialModel from "./product-special";

const fakeDatabase = new FakeDatabase();
const model = new ProductSpecialModel(fakeDatabase);

const table: string = "product_special";
const data = { price: 10 };
const updated = { ...data, priority: 2 };
const criteria = { productSpecialId: -1 };
const initialValues = initialProductSpecial;

test("insert", async () => {
  const result = await model.insert(data);
  expect(result).toBeResponseHeaders();
  criteria.productSpecialId = result.insertId;
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
