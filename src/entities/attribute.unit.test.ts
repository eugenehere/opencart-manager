import FakeDatabase from "../__mocks__/database";
import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import errors from "../errors";
import Model from "../model";
import Attribute from "./attribute";

let entity: Attribute;
const entityId: number = 12;
const attributeGroupId = 123;
const entityData = { sortOrder: 0 };
const entityDescriptionRus = { languageId: 1, name: "RuName" };
const entityDescriptionEng = { languageId: 2, name: "EngName" };
const entityDataUpdated = { sortOrder: 1 };
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

model.attribute.insert = jest.fn(async () => headers);
model.attribute.update = jest.fn(async () => headers);
model.attribute.delete = jest.fn(async () => headers);
model.attribute.description.insert = jest.fn(async () => headers);
model.attribute.description.update = jest.fn(async () => headers);
model.attribute.description.delete = jest.fn(async () => headers);

test("Instantiate", () => {
  entity = new Attribute(model, attributeGroupId)
    .setData(entityData)
    .setDescription(entityDescriptionRus)
    .setDescription(entityDescriptionEng);

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
  expect(model.attribute.insert).toHaveBeenNthCalledWith(1, {
    ...entityData,
    attributeGroupId,
  });
  expect(model.attribute.description.insert).toHaveBeenNthCalledWith(1, {
    ...entityDescriptionRus,
    attributeId: entityId,
  });
  expect(model.attribute.description.insert).toHaveBeenNthCalledWith(2, {
    ...entityDescriptionEng,
    attributeId: entityId,
  });
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
  expect(model.attribute.update).toHaveBeenNthCalledWith(
    1,
    {
      attributeId: entityId,
    },
    {
      ...entityDataUpdated,
      attributeGroupId,
      attributeId: entityId,
    }
  );
  expect(model.attribute.description.update).toHaveBeenNthCalledWith(
    1,
    {
      attributeId: entityId,
      languageId: 1,
    },
    {
      ...entityDescriptionRusUpdated,
      attributeId: entityId,
    }
  );
  expect(model.attribute.description.update).toHaveBeenNthCalledWith(
    2,
    {
      attributeId: entityId,
      languageId: 2,
    },
    {
      ...entityDescriptionEngUpdated,
      attributeId: entityId,
    }
  );
});

test("Delete", async () => {
  await entity.delete();
  expect(model.attribute.delete).toHaveBeenNthCalledWith(1, {
    attributeId: entityId,
  });
  expect(model.attribute.description.delete).toHaveBeenNthCalledWith(1, {
    attributeId: entityId,
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
