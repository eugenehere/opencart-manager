import FakeDatabase from "../__mocks__/database";
import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import errors from "../errors";
import Model from "../model";
import ProductSpecial from "./product-special";

let entity: ProductSpecial;
const entityId: number = 12;
const productId = 55;
const entityData = { price: 1111, priority: 1 };
const entityDataUpdated = { ...entityData, priority: 2 };
const headers = { ...fakeResultSetHeader, insertId: entityId };
const db = new FakeDatabase();
const model = new Model(db);

model.product.special.insert = jest.fn(async () => headers);
model.product.special.update = jest.fn(async () => headers);
model.product.special.delete = jest.fn(async () => headers);

test("Instantiate", () => {
  entity = new ProductSpecial(model, productId).setData(entityData);

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
  expect(model.product.special.insert).toHaveBeenNthCalledWith(1, {
    ...entityData,
    productId,
  });
});

test("Update", async () => {
  entity.setData(entityDataUpdated);

  await entity.update();
  expect(entity.id).toBe(headers.insertId);
  expect(entity.data).toStrictEqual(entityDataUpdated);
  expect(model.product.special.update).toHaveBeenNthCalledWith(
    1,
    {
      productSpecialId: entityId,
    },
    {
      ...entityDataUpdated,
      productSpecialId: entityId,
      productId,
    }
  );
});

test("Delete", async () => {
  await entity.delete();
  expect(model.product.special.delete).toHaveBeenNthCalledWith(1, {
    productSpecialId: entityId,
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
