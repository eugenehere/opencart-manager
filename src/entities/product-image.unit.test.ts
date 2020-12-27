import FakeDatabase from "../__mocks__/database";
import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import errors from "../errors";
import Model from "../model";
import ProductImage from "./product-image";

let entity: ProductImage;
const entityId: number = 12;
const productId = 55;
const entityData = { image: "path/to/image" };
const entityDataUpdated = { image: "path/to/image/new" };
const headers = { ...fakeResultSetHeader, insertId: entityId };
const db = new FakeDatabase();
const model = new Model(db);

model.product.image.insert = jest.fn(async () => headers);
model.product.image.update = jest.fn(async () => headers);
model.product.image.delete = jest.fn(async () => headers);

test("Instantiate", () => {
  entity = new ProductImage(model, productId).setData(entityData);
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
  expect(model.product.image.insert).toHaveBeenNthCalledWith(1, {
    ...entityData,
    productId,
  });
});

test("Update", async () => {
  entity.setData(entityDataUpdated);
  await entity.update();
  expect(entity.id).toBe(headers.insertId);
  expect(entity.data).toStrictEqual(entityDataUpdated);
  expect(model.product.image.update).toHaveBeenNthCalledWith(
    1,
    {
      productImageId: entityId,
    },
    {
      ...entityDataUpdated,
      productImageId: entityId,
      productId,
    }
  );
});

test("Delete", async () => {
  await entity.delete();
  expect(model.product.image.delete).toHaveBeenNthCalledWith(1, {
    productImageId: entityId,
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
