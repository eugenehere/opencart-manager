import FakeDatabase from "../__mocks__/database";
import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import errors from "../errors";
import Model from "../model";
import Manufacturer from "./manufacturer";

let entity: Manufacturer;
const entityId: number = 12;
const entityData = { image: "test/image.png" };
const entityDescriptionRus = { languageId: 1, name: "RuName" };
const entityDescriptionEng = { languageId: 2, name: "EngName" };
const entityDataUpdated = { image: "test/image2.png" };
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

model.manufacturer.insert = jest.fn(async () => headers);
model.manufacturer.update = jest.fn(async () => headers);
model.manufacturer.delete = jest.fn(async () => headers);
model.manufacturer.description.insert = jest.fn(async () => headers);
model.manufacturer.description.update = jest.fn(async () => headers);
model.manufacturer.description.delete = jest.fn(async () => headers);

test("Instantiate", () => {
  entity = new Manufacturer(model)
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
  expect(model.manufacturer.insert).toHaveBeenNthCalledWith(1, entityData);
  expect(model.manufacturer.description.insert).toHaveBeenNthCalledWith(1, {
    ...entityDescriptionRus,
    manufacturerId: entityId,
  });
  expect(model.manufacturer.description.insert).toHaveBeenNthCalledWith(2, {
    ...entityDescriptionEng,
    manufacturerId: entityId,
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
  expect(model.manufacturer.update).toHaveBeenNthCalledWith(
    1,
    {
      manufacturerId: entityId,
    },
    {
      ...entityDataUpdated,
      manufacturerId: entityId,
    }
  );
  expect(model.manufacturer.description.update).toHaveBeenNthCalledWith(
    1,
    {
      manufacturerId: entityId,
      languageId: 1,
    },
    {
      ...entityDescriptionRusUpdated,
      manufacturerId: entityId,
    }
  );
  expect(model.manufacturer.description.update).toHaveBeenNthCalledWith(
    2,
    {
      manufacturerId: entityId,
      languageId: 2,
    },
    {
      ...entityDescriptionEngUpdated,
      manufacturerId: entityId,
    }
  );
});

test("Delete", async () => {
  await entity.delete();
  expect(model.manufacturer.delete).toHaveBeenNthCalledWith(1, {
    manufacturerId: entityId,
  });
  expect(model.manufacturer.description.delete).toHaveBeenNthCalledWith(1, {
    manufacturerId: entityId,
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
