import FakeDatabase from "../__mocks__/database";
import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import errors from "../errors";
import Model from "../model";
import Option from "./option";

let entity: Option;
const entityId: number = 12;
const entityData = { type: "select" };
const entityDescriptionRus = { languageId: 1, name: "RuName" };
const entityDescriptionEng = { languageId: 2, name: "EngName" };
const entityDataUpdated = { type: "radio" };
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

model.option.insert = jest.fn(async () => headers);
model.option.update = jest.fn(async () => headers);
model.option.delete = jest.fn(async () => headers);
model.option.description.insert = jest.fn(async () => headers);
model.option.description.update = jest.fn(async () => headers);
model.option.description.delete = jest.fn(async () => headers);

test("Instantiate", () => {
  entity = new Option(model)
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
  expect(model.option.insert).toHaveBeenNthCalledWith(1, entityData);
  expect(model.option.description.insert).toHaveBeenNthCalledWith(1, {
    ...entityDescriptionRus,
    optionId: entityId,
  });
  expect(model.option.description.insert).toHaveBeenNthCalledWith(2, {
    ...entityDescriptionEng,
    optionId: entityId,
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
  expect(model.option.update).toHaveBeenNthCalledWith(
    1,
    {
      optionId: entityId,
    },
    {
      ...entityDataUpdated,
      optionId: entityId,
    }
  );
  expect(model.option.description.update).toHaveBeenNthCalledWith(
    1,
    {
      optionId: entityId,
      languageId: 1,
    },
    {
      ...entityDescriptionRusUpdated,
      optionId: entityId,
    }
  );
  expect(model.option.description.update).toHaveBeenNthCalledWith(
    2,
    {
      optionId: entityId,
      languageId: 2,
    },
    {
      ...entityDescriptionEngUpdated,
      optionId: entityId,
    }
  );
});

test("Delete", async () => {
  await entity.delete();
  expect(model.option.delete).toHaveBeenNthCalledWith(1, {
    optionId: entityId,
  });
  expect(model.option.description.delete).toHaveBeenNthCalledWith(1, {
    optionId: entityId,
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
