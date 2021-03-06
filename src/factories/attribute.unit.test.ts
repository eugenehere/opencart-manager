import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import Attribute from "../entities/attribute";
import AttributeGroup from "../entities/attribute-group";
import { initialAttribute, initialAttributeDescription } from "../initial";
import Model from "../model";
import AttributeFactory from "./attribute";

const attributeId = 1;
const attributeGroupId = 123;

const entityRowsData = [
  {
    ...initialAttribute,
    attributeId,
    attributeGroupId,
    sortOrder: 123,
  },
];

const entityDescriptionRowsData = [
  {
    ...initialAttributeDescription,
    attributeId,
    languageId: 1,
    name: "test1",
  },
  {
    ...initialAttributeDescription,
    attributeId,
    languageId: 2,
    name: "test2",
  },
];

jest.mock("../entities/attribute", () => ({
  __esModule: true,
  default: jest.fn(
    (model, ...dependencies) => new FakeEntity(model, ...dependencies)
  ),
}));

const database = new Database();
const model = new Model(database);

model.attribute.select = jest.fn(async () => entityRowsData);
model.attribute.description.select = jest.fn(
  async () => entityDescriptionRowsData
);

const factory = new AttributeFactory(model);

test("creates a new entity", () => {
  const entity = factory.create({ id: attributeGroupId } as AttributeGroup);
  expect(entity).toBeInstanceOf(FakeEntity);
});

test("extracts and returns an entity", async () => {
  const entity = await factory.extract({ attributeId });
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.attribute.select).toHaveBeenNthCalledWith(1, { attributeId });
  expect(model.attribute.description.select).toHaveBeenNthCalledWith(1, {
    attributeId,
  });
  expect(Attribute).toHaveBeenNthCalledWith(
    2,
    model,
    attributeGroupId,
    attributeId
  );
  expect(entity!.data.sortOrder).toBe(123);
  expect(entity!.description[1].name).toBe("test1");
  expect(entity!.description[2].name).toBe("test2");
});

test("extracts all and returns an entities array", async () => {
  const entities = await factory.extractAll({ attributeId });
  expect(entities).toBeArray();
  const entity = entities[0];
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.attribute.select).toHaveBeenNthCalledWith(2, { attributeId });
  expect(model.attribute.description.select).toHaveBeenNthCalledWith(2, {
    attributeId,
  });
  expect(Attribute).toHaveBeenNthCalledWith(
    3,
    model,
    attributeGroupId,
    attributeId
  );
  expect(entity.data.sortOrder).toBe(123);
  expect(entity.description[1].name).toBe("test1");
  expect(entity.description[2].name).toBe("test2");
});

test("extracts and returns an undefined", async () => {
  model.attribute.select = jest.fn(async () => []);
  const entity = await factory.extract({ attributeId: 9999 });
  expect(entity).toBeUndefined();
});

test("extracts all and returns an empty array", async () => {
  const entities = await factory.extractAll({ attributeId: 9999 });
  expect(entities).toBeArray();
  expect(entities.length).toBe(0);
});
