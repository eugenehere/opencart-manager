import FakeDatabase from "../__mocks__/database";
import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import errors from "../errors";
import Model from "../model";
import { TProduct } from "../types";
import Attribute from "./attribute";
import Category from "./category";
import Product from "./product";

let entity: Product;
const entityId: number = 12;
const entityData: Partial<TProduct> = { quantity: 2, price: 1111 };
const entityDescriptionRus = { languageId: 1, name: "RuName" };
const entityDescriptionEng = { languageId: 2, name: "EngName" };
const entityDataUpdated = { ...entityData, price: 2222 };
const entityDescriptionRusUpdated = {
  ...entityDescriptionRus,
  name: "RuNameNew",
};
const entityDescriptionEngUpdated = {
  ...entityDescriptionEng,
  name: "EngNameNew",
};
const headers = { ...fakeResultSetHeader, insertId: entityId };
const db = new FakeDatabase();
const model = new Model(db);

const categoryNotInserted = new Category(model);
const category = new Category(model, 6);

const attributeNotInserted = new Attribute(model, 321);
const attribute = new Attribute(model, 321, 5);

model.product.insert = jest.fn(async () => headers);
model.product.update = jest.fn(async () => headers);
model.product.delete = jest.fn(async () => headers);
model.product.description.insert = jest.fn(async () => headers);
model.product.description.update = jest.fn(async () => headers);
model.product.description.delete = jest.fn(async () => headers);
model.product.toStore = jest.fn(async () => headers);
model.product.toCategory = jest.fn(async () => headers);
model.product.attribute.insert = jest.fn(async () => headers);
model.product.attribute.delete = jest.fn(async () => headers);
model.product.special.delete = jest.fn(async () => headers);

test("Instantiate", () => {
  entity = new Product(model)
    .setData(entityData)
    .setDescription(entityDescriptionRus)
    .setDescription(entityDescriptionEng);

  entityData.dateAdded = entity.data.dateAdded;
  entityData.dateModified = entity.data.dateModified;
  entityDataUpdated.dateAdded = entity.data.dateAdded;
  entityDataUpdated.dateModified = entity.data.dateModified;
  expect(entity.id).toBeUndefined();
  expect(entity.data).toStrictEqual(entityData);
  expect(entity.description[1]).toStrictEqual(entityDescriptionRus);
  expect(entity.description[2]).toStrictEqual(entityDescriptionEng);
  expect(async () => entity.update()).rejects.toThrow(
    errors.ENTITY_NOT_INSERTED
  );
  expect(async () => entity.delete()).rejects.toThrow(
    errors.ENTITY_NOT_INSERTED
  );
  expect(async () => entity.toCategory(categoryNotInserted)).rejects.toThrow(
    errors.ENTITY_NOT_INSERTED
  );
  expect(async () =>
    entity.setAttribute(attributeNotInserted, {})
  ).rejects.toThrow(errors.ENTITY_NOT_INSERTED);
});

test("Insert", async () => {
  await entity.insert();
  expect(async () => entity.insert()).rejects.toThrow(errors.ENTITY_INSERTED);
  expect(entity.id).toBe(headers.insertId);
  expect(entity.data).toStrictEqual(entityData);
  expect(entity.description[1]).toStrictEqual(entityDescriptionRus);
  expect(entity.description[2]).toStrictEqual(entityDescriptionEng);
  expect(model.product.insert).toHaveBeenNthCalledWith(1, entityData);
  expect(model.product.toStore).toHaveBeenNthCalledWith(1, entityId, 0);
  expect(model.product.description.insert).toHaveBeenNthCalledWith(1, {
    ...entityDescriptionRus,
    productId: entityId,
  });
  expect(model.product.description.insert).toHaveBeenNthCalledWith(2, {
    ...entityDescriptionEng,
    productId: entityId,
  });
  expect(async () => entity.toCategory(categoryNotInserted)).rejects.toThrow(
    errors.NOT_SPECIFIED("category.id")
  );
  expect(async () =>
    entity.setAttribute(attributeNotInserted, {})
  ).rejects.toThrow(errors.NOT_SPECIFIED("attribute.id"));
});

test("Update", async () => {
  entity
    .setData(entityDataUpdated)
    .setDescription(entityDescriptionRusUpdated)
    .setDescription(entityDescriptionEngUpdated);

  await entity.update();
  expect(entity.id).toBe(headers.insertId);
  expect(entity.data).toStrictEqual(entityDataUpdated);
  expect(entity.description[1]).toStrictEqual(entityDescriptionRusUpdated);
  expect(entity.description[2]).toStrictEqual(entityDescriptionEngUpdated);
  expect(model.product.update).toHaveBeenNthCalledWith(
    1,
    {
      productId: entityId,
    },
    {
      ...entityDataUpdated,
      productId: entityId,
    }
  );
  expect(model.product.description.update).toHaveBeenNthCalledWith(
    1,
    {
      productId: entityId,
      languageId: 1,
    },
    {
      ...entityDescriptionRusUpdated,
      productId: entityId,
    }
  );
  expect(model.product.description.update).toHaveBeenNthCalledWith(
    2,
    {
      productId: entityId,
      languageId: 2,
    },
    {
      ...entityDescriptionEngUpdated,
      productId: entityId,
    }
  );
});

test("toCategory", async () => {
  await entity.toCategory(category);
  expect(model.product.toCategory).toHaveBeenNthCalledWith(
    1,
    entityId,
    category.id,
    0
  );
});

test("setAttribute", async () => {
  await entity.setAttribute(attribute, { languageId: 1, text: "asd" });
  expect(model.product.attribute.insert).toHaveBeenNthCalledWith(1, {
    productId: entityId,
    attributeId: attribute.id,
    languageId: 1,
    text: "asd",
  });
});

test("Delete", async () => {
  await entity.delete();
  expect(model.product.delete).toHaveBeenNthCalledWith(1, {
    productId: entityId,
  });
  expect(model.product.description.delete).toHaveBeenNthCalledWith(1, {
    productId: entityId,
  });
  expect(model.product.attribute.delete).toHaveBeenNthCalledWith(1, {
    productId: entityId,
  });
  expect(model.product.special.delete).toHaveBeenNthCalledWith(1, {
    productId: entityId,
  });
  expect(entity.id).toBeUndefined();
  expect(entity.data).toStrictEqual(entityDataUpdated);
  expect(entity.description[1]).toStrictEqual(entityDescriptionRusUpdated);
  expect(entity.description[2]).toStrictEqual(entityDescriptionEngUpdated);
  expect(async () => entity.update()).rejects.toThrow(
    errors.ENTITY_NOT_INSERTED
  );
  expect(async () => entity.delete()).rejects.toThrow(
    errors.ENTITY_NOT_INSERTED
  );
});
