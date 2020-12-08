import FakeDatabase from "../__mocks__/database";
import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import errors from "../errors";
import Model from "../model";
import { TCategory } from "../types";
import Category from "./category";

let entity: Category;
const entityId: number = 12;
const entityData: Partial<TCategory> = { image: "test/image.png" };
const entityDescriptionRus = { languageId: 1, name: "RuName" };
const entityDescriptionEng = { languageId: 2, name: "EngName" };
const entityPath = { categoryId: entityId, pathId: entityId, level: 0 };
const entityDataUpdated = { ...entityData, image: "test/image2.png" };
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

model.category.insert = jest.fn(async () => headers);
model.category.update = jest.fn(async () => headers);
model.category.delete = jest.fn(async () => headers);
model.category.description.insert = jest.fn(async () => headers);
model.category.description.update = jest.fn(async () => headers);
model.category.description.delete = jest.fn(async () => headers);
model.category.toLayout = jest.fn(async () => headers);
model.category.toStore = jest.fn(async () => headers);
model.category.path.insert = jest.fn(async () => headers);

test("Instantiate", () => {
  entity = new Category(model)
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
});

test("Insert", async () => {
  await entity.insert();
  expect(async () => entity.insert()).rejects.toThrow(errors.ENTITY_INSERTED);
  expect(entity.id).toBe(headers.insertId);
  expect(entity.data).toStrictEqual(entityData);
  expect(entity.description[1]).toStrictEqual(entityDescriptionRus);
  expect(entity.description[2]).toStrictEqual(entityDescriptionEng);
  expect(model.category.insert).toHaveBeenNthCalledWith(1, entityData);
  expect(model.category.description.insert).toHaveBeenNthCalledWith(1, {
    ...entityDescriptionRus,
    categoryId: entityId,
  });
  expect(model.category.description.insert).toHaveBeenNthCalledWith(2, {
    ...entityDescriptionEng,
    categoryId: entityId,
  });
  expect(model.category.path.insert).toHaveBeenNthCalledWith(1, entityPath);
  expect(model.category.toStore).toHaveBeenNthCalledWith(1, entityId, 0);
  expect(model.category.toLayout).toHaveBeenNthCalledWith(1, entityId, 0, 0);
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
  expect(model.category.update).toHaveBeenNthCalledWith(
    1,
    {
      categoryId: entityId,
    },
    {
      ...entityDataUpdated,
      categoryId: entityId,
    }
  );
  expect(model.category.description.update).toHaveBeenNthCalledWith(
    1,
    {
      categoryId: entityId,
      languageId: 1,
    },
    {
      ...entityDescriptionRusUpdated,
      categoryId: entityId,
    }
  );
  expect(model.category.description.update).toHaveBeenNthCalledWith(
    2,
    {
      categoryId: entityId,
      languageId: 2,
    },
    {
      ...entityDescriptionEngUpdated,
      categoryId: entityId,
    }
  );
});

test("Delete", async () => {
  await entity.delete();
  expect(model.category.delete).toHaveBeenNthCalledWith(1, {
    categoryId: entityId,
  });
  expect(model.category.description.delete).toHaveBeenNthCalledWith(1, {
    categoryId: entityId,
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
