import FakeDatabase from "../__mocks__/database";
import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import errors from "../errors";
import Model from "../model";
import AttributeGroup from "./attribute-group";

let entity: AttributeGroup;
const entityId: number = 12;
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

model.attribute.group.insert = jest.fn(async () => headers);
model.attribute.group.update = jest.fn(async () => headers);
model.attribute.group.delete = jest.fn(async () => headers);
model.attribute.group.description.insert = jest.fn(async () => headers);
model.attribute.group.description.update = jest.fn(async () => headers);
model.attribute.group.description.delete = jest.fn(async () => headers);

test("Instantiate", () => {
  entity = new AttributeGroup(model)
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
  expect(model.attribute.group.insert).toHaveBeenNthCalledWith(1, entityData);
  expect(model.attribute.group.description.insert).toHaveBeenNthCalledWith(1, {
    ...entityDescriptionRus,
    attributeGroupId: entityId,
  });
  expect(model.attribute.group.description.insert).toHaveBeenNthCalledWith(2, {
    ...entityDescriptionEng,
    attributeGroupId: entityId,
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
  expect(model.attribute.group.update).toHaveBeenNthCalledWith(
    1,
    {
      attributeGroupId: entityId,
    },
    {
      ...entityDataUpdated,
      attributeGroupId: entityId,
    }
  );
  expect(model.attribute.group.description.update).toHaveBeenNthCalledWith(
    1,
    {
      attributeGroupId: entityId,
      languageId: 1,
    },
    {
      ...entityDescriptionRusUpdated,
      attributeGroupId: entityId,
    }
  );
  expect(model.attribute.group.description.update).toHaveBeenNthCalledWith(
    2,
    {
      attributeGroupId: entityId,
      languageId: 2,
    },
    {
      ...entityDescriptionEngUpdated,
      attributeGroupId: entityId,
    }
  );
});

test("Delete", async () => {
  await entity.delete();
  expect(model.attribute.group.delete).toHaveBeenNthCalledWith(1, {
    attributeGroupId: entityId,
  });
  expect(model.attribute.group.description.delete).toHaveBeenNthCalledWith(1, {
    attributeGroupId: entityId,
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
