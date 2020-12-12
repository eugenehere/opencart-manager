import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import Category from "../entities/category";
import { initialCategory, initialCategoryDescription } from "../initial";
import Model from "../model";
import CategoryFactory from "./category";

const categoryId = 1;

const entityRowsData = [
  {
    ...initialCategory,
    categoryId,
    sortOrder: 123,
  },
];

const entityDescriptionRowsData = [
  {
    ...initialCategoryDescription,
    categoryId,
    languageId: 1,
    name: "test1",
  },
  {
    ...initialCategoryDescription,
    categoryId,
    languageId: 2,
    name: "test2",
  },
];

jest.mock("../entities/category", () => ({
  __esModule: true,
  default: jest.fn(
    (model, ...dependencies) => new FakeEntity(model, ...dependencies)
  ),
}));

const database = new Database();
const model = new Model(database);

model.category.select = jest.fn(async () => entityRowsData);
model.category.description.select = jest.fn(
  async () => entityDescriptionRowsData
);

const factory = new CategoryFactory(model);

test("creates a new entity", () => {
  const entity = factory.create();
  expect(entity).toBeInstanceOf(FakeEntity);
});

test("extracts and returns an entity", async () => {
  const entity = await factory.extract({ categoryId });
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.category.select).toHaveBeenNthCalledWith(1, { categoryId });
  expect(model.category.description.select).toHaveBeenNthCalledWith(1, {
    categoryId,
  });
  expect(Category).toHaveBeenNthCalledWith(2, model, categoryId);
  expect(entity!.data.sortOrder).toBe(123);
  expect(entity!.description[1].name).toBe("test1");
  expect(entity!.description[2].name).toBe("test2");
});

test("extracts all and returns an entities array", async () => {
  const entities = await factory.extractAll({ categoryId });
  expect(entities).toBeArray();
  const entity = entities[0];
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.category.select).toHaveBeenNthCalledWith(2, { categoryId });
  expect(model.category.description.select).toHaveBeenNthCalledWith(2, {
    categoryId,
  });
  expect(Category).toHaveBeenNthCalledWith(3, model, categoryId);
  expect(entity.data.sortOrder).toBe(123);
  expect(entity.description[1].name).toBe("test1");
  expect(entity.description[2].name).toBe("test2");
});

test("extracts and returns an undefined", async () => {
  model.category.select = jest.fn(async () => []);
  const entity = await factory.extract({ categoryId: 9999 });
  expect(entity).toBeUndefined();
});

test("extracts all and returns an empty array", async () => {
  const entities = await factory.extractAll({ categoryId: 9999 });
  expect(entities).toBeArray();
  expect(entities.length).toBe(0);
});
