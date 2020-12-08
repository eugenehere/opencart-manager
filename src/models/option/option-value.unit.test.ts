import FakeDatabase from "../../__mocks__/database";
import { initialOptionValue } from "../../initial";
import { toFieldset } from "../../utils";
import OptionValueModel from "./option-value";

const fakeDatabase = new FakeDatabase();
const model = new OptionValueModel(fakeDatabase);

let id: number;
const table: string = "option_value";
const data = { image: "image.png" };
const updated = { ...data, image: "image2.png" };
const criteria = { optionValueId: -1 };
const initialValues = initialOptionValue;

test("insert", async () => {
  const result = await model.insert(data);
  expect(result).toBeResponseHeaders();
  criteria.optionValueId = id = result.insertId;
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
