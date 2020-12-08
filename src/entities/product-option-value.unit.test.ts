import FakeDatabase from "../__mocks__/database";
import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import errors from "../errors";
import Model from "../model";
import ProductOptionValue from "./product-option-value";

let entity: ProductOptionValue;
const entityId: number = 12;
const productId = 55;
const optionId = 66;
const productOptionId = 145;
const optionValueId = 130;
const entityData = { price: 1111 };
const entityDataUpdated = { price: 2222 };
const headers = { ...fakeResultSetHeader, insertId: entityId };
const db = new FakeDatabase();
const model = new Model(db);

model.product.option.value.insert = jest.fn(async () => headers);
model.product.option.value.update = jest.fn(async () => headers);
model.product.option.value.delete = jest.fn(async () => headers);
model.product.option.select = jest.fn(async () => [{ productId }]);
model.option.value.select = jest.fn(async () => [{ optionId }]);

test("Instantiate", () => {
  entity = new ProductOptionValue(
    model,
    productOptionId,
    optionValueId
  ).setData(entityData);

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
  expect(model.product.option.value.insert).toHaveBeenNthCalledWith(1, {
    ...entityData,
    productOptionId,
    productId,
    optionId,
    optionValueId,
  });
  expect(model.product.option.select).toHaveBeenNthCalledWith(1, {
    productOptionId,
  });
  expect(model.option.value.select).toHaveBeenNthCalledWith(1, {
    optionValueId,
  });
});

test("Update", async () => {
  entity.setData(entityDataUpdated);

  await entity.update();
  expect(entity.id).toBe(headers.insertId);
  expect(entity.data).toStrictEqual(entityDataUpdated);
  expect(model.product.option.select).toHaveBeenNthCalledWith(2, {
    productOptionId,
  });
  expect(model.option.value.select).toHaveBeenNthCalledWith(2, {
    optionValueId,
  });
  expect(model.product.option.value.update).toHaveBeenNthCalledWith(
    1,
    {
      productOptionValueId: entityId,
    },
    {
      ...entityDataUpdated,
      productOptionValueId: entityId,
      productOptionId,
      productId,
      optionId,
      optionValueId,
    }
  );
});

test("Delete", async () => {
  await entity.delete();
  expect(model.product.option.value.delete).toHaveBeenNthCalledWith(1, {
    productOptionValueId: entityId,
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
