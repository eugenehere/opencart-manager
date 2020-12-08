import FakeDatabase from "../__mocks__/database";
import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import errors from "../errors";
import Model from "../model";
import OptionValue from "./option-value";

let entity: OptionValue;
const entityId: number = 12;
const optionId = 123;
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

model.option.value.insert = jest.fn(async () => headers);
model.option.value.update = jest.fn(async () => headers);
model.option.value.delete = jest.fn(async () => headers);
model.option.value.description.insert = jest.fn(async () => headers);
model.option.value.description.update = jest.fn(async () => headers);
model.option.value.description.delete = jest.fn(async () => headers);

test("Instantiate", () => {
  entity = new OptionValue(model, optionId)
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
  expect(model.option.value.insert).toHaveBeenNthCalledWith(1, {
    ...entityData,
    optionId,
  });
  expect(model.option.value.description.insert).toHaveBeenNthCalledWith(1, {
    ...entityDescriptionRus,
    optionValueId: entityId,
    optionId,
  });
  expect(model.option.value.description.insert).toHaveBeenNthCalledWith(2, {
    ...entityDescriptionEng,
    optionValueId: entityId,
    optionId,
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
  expect(model.option.value.update).toHaveBeenNthCalledWith(
    1,
    {
      optionValueId: entityId,
    },
    {
      ...entityDataUpdated,
      optionValueId: entityId,
      optionId,
    }
  );
  expect(model.option.value.description.update).toHaveBeenNthCalledWith(
    1,
    {
      optionValueId: entityId,
      languageId: 1,
    },
    {
      ...entityDescriptionRusUpdated,
      optionValueId: entityId,
      optionId,
    }
  );
  expect(model.option.value.description.update).toHaveBeenNthCalledWith(
    2,
    {
      optionValueId: entityId,
      languageId: 2,
    },
    {
      ...entityDescriptionEngUpdated,
      optionValueId: entityId,
      optionId,
    }
  );
});

test("Delete", async () => {
  await entity.delete();
  expect(model.option.value.delete).toHaveBeenNthCalledWith(1, {
    optionValueId: entityId,
  });
  expect(model.option.value.description.delete).toHaveBeenNthCalledWith(1, {
    optionValueId: entityId,
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
