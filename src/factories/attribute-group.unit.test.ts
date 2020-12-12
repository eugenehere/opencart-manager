import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import AttributeGroup from "../entities/attribute-group";
import { initialAttributeGroup, initialAttributeGroupDescription } from "../initial";
import Model from "../model";
import AttributeGroupFactory from "./attribute-group";

const attributeGroupId = 123;

const entityRowsData = [
  {
    ...initialAttributeGroup,
    attributeGroupId,
    sortOrder: 123,
  },
];

const entityDescriptionRowsData = [
  {
    ...initialAttributeGroupDescription,
    attributeGroupId,
    languageId: 1,
    name: "test1",
  },
  {
    ...initialAttributeGroupDescription,
    attributeGroupId,
    languageId: 2,
    name: "test2",
  },
];

jest.mock("../entities/attribute-group", () => ({
  __esModule: true,
  default: jest.fn(
    (model, ...dependencies) => new FakeEntity(model, ...dependencies)
  ),
}));

const database = new Database();
const model = new Model(database);

model.attribute.group.select = jest.fn(async () => entityRowsData);
model.attribute.group.description.select = jest.fn(
  async () => entityDescriptionRowsData
);

const factory = new AttributeGroupFactory(model);

test("creates a new entity", () => {
  const entity = factory.create();
  expect(entity).toBeInstanceOf(FakeEntity);
});

test("extracts and returns an entity", async () => {
  const entity = await factory.extract({ attributeGroupId });
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.attribute.group.select).toHaveBeenNthCalledWith(1, { attributeGroupId });
  expect(model.attribute.group.description.select).toHaveBeenNthCalledWith(1, {
    attributeGroupId,
  });
  expect(AttributeGroup).toHaveBeenNthCalledWith(
    2,
    model,
    attributeGroupId,
  );
  expect(entity!.data.sortOrder).toBe(123);
  expect(entity!.description[1].name).toBe("test1");
  expect(entity!.description[2].name).toBe("test2");
});

test("extracts all and returns an entities array", async () => {
  const entities = await factory.extractAll({ attributeGroupId });
  expect(entities).toBeArray();
  const entity = entities[0];
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.attribute.group.select).toHaveBeenNthCalledWith(2, { attributeGroupId });
  expect(model.attribute.group.description.select).toHaveBeenNthCalledWith(2, {
    attributeGroupId,
  });
  expect(AttributeGroup).toHaveBeenNthCalledWith(
    3,
    model,
    attributeGroupId,
  );
  expect(entity.data.sortOrder).toBe(123);
  expect(entity.description[1].name).toBe("test1");
  expect(entity.description[2].name).toBe("test2");
});

test("extracts and returns an undefined", async () => {
  model.attribute.group.select = jest.fn(async () => []);
  const entity = await factory.extract({ attributeGroupId: 9999 });
  expect(entity).toBeUndefined();
});

test("extracts all and returns an empty array", async () => {
  const entities = await factory.extractAll({ attributeGroupId: 9999 });
  expect(entities).toBeArray();
  expect(entities.length).toBe(0);
});
