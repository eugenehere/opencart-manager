import FakeDatabase from "../__mocks__/database";
import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import errors from "../errors";
import Model from "../model";
import ProductOption from "./product-option";

let entity: ProductOption;
const entityId: number = 12;
const productId = 55;
const optionId = 66;
const entityData = { value: "test value" };
const entityDataUpdated = { value: "new test value" };
const headers = { ...fakeResultSetHeader, insertId: entityId };
const db = new FakeDatabase();
const model = new Model(db);

model.product.option.insert = jest.fn(async () => headers);
model.product.option.update = jest.fn(async () => headers);
model.product.option.delete = jest.fn(async () => headers);

test("Instantiate", () => {
  entity = new ProductOption(model, productId, optionId).setData(entityData);

  expect(entity.id).toBeUndefined();
  expect(entity.data).toStrictEqual(entityData);
  expect(async () => entity.update()).rejects.toThrow(
    errors.ENTITY_NOT_INSERTED
  );
  expect(async () => entity.delete()).rejects.toThrow(
    errors.ENTITY_NOT_INSERTED
  );
});

test("Insert", async () => {
  await entity.insert();
  expect(async () => entity.insert()).rejects.toThrow(errors.ENTITY_INSERTED);
  expect(entity.id).toBe(headers.insertId);
  expect(entity.data).toStrictEqual(entityData);
  expect(model.product.option.insert).toHaveBeenNthCalledWith(1, {
    ...entityData,
    productId,
    optionId,
  });
});

test("Update", async () => {
  entity.setData(entityDataUpdated);

  await entity.update();
  expect(entity.id).toBe(headers.insertId);
  expect(entity.data).toStrictEqual(entityDataUpdated);
  expect(model.product.option.update).toHaveBeenNthCalledWith(
    1,
    {
      productOptionId: entityId,
    },
    {
      ...entityDataUpdated,
      productOptionId: entityId,
      productId,
      optionId,
    }
  );
});

test("Delete", async () => {
  await entity.delete();
  expect(model.product.option.delete).toHaveBeenNthCalledWith(1, {
    productOptionId: entityId,
  });
  expect(entity.id).toBeUndefined();
  expect(entity.data).toStrictEqual(entityDataUpdated);
  expect(async () => entity.update()).rejects.toThrow(
    errors.ENTITY_NOT_INSERTED
  );
  expect(async () => entity.delete()).rejects.toThrow(
    errors.ENTITY_NOT_INSERTED
  );
});
