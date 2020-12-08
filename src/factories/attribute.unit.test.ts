import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import Attribute from "../entities/attribute";
import { initialAttribute, initialAttributeDescription } from "../initial";
import Model from "../model";
import AttributeFactory from "./attribute";

const attributeId = 1;
const attributeGroupId = 123;
const database = new Database();
const model = new Model(database);

jest.mock("../entities/Attribute", () => ({
  __esModule: true,
  default: jest.fn((m, ...p) => new FakeEntity(m, ...p)),
}));

// import AttributeMocked from '../entities/Attribute';

model.attribute.select = jest.fn(async (criteria) => {
  if (criteria.attributeId !== attributeId) return [];
  return [
    {
      ...initialAttribute,
      attributeId,
      attributeGroupId,
      sortOrder: 123,
    },
  ];
});
model.attribute.description.select = jest.fn(async () => [
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
]);

const factory = new AttributeFactory(model);

test("create", () => {});

test("extract returns an entity", async () => {
  const entity = await factory.extract({ attributeId: 1 });
  expect(entity).toBeDefined();
  expect(model.attribute.select).toHaveBeenNthCalledWith(1, { attributeId });
  expect(model.attribute.description.select).toHaveBeenNthCalledWith(1, {
    attributeId,
  });
  expect(Attribute).toHaveBeenNthCalledWith(
    1,
    model,
    attributeGroupId,
    attributeId
  );
  expect(entity!.data.sortOrder).toBe(123);
  expect(entity!.description[1].name).toBe("test1");
  expect(entity!.description[2].name).toBe("test2");
});

test("extract returns undefined", async () => {
  const entity = await factory.extract({ attributeId: 123123 });
  expect(entity).toBeUndefined();
});
