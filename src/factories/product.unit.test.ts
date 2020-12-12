import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import Product from "../entities/product";
import { initialProduct, initialProductDescription } from "../initial";
import Model from "../model";
import ProductFactory from "./product";

const productId = 12;

const entityRowsData = [
  {
    ...initialProduct,
    productId,
    sortOrder: 123,
  },
];

const entityDescriptionRowsData = [
  {
    ...initialProductDescription,
    productId,
    languageId: 1,
    name: "test1",
  },
  {
    ...initialProductDescription,
    productId,
    languageId: 2,
    name: "test2",
  },
];

jest.mock("../entities/product", () => ({
  __esModule: true,
  default: jest.fn(
    (model, ...dependencies) => new FakeEntity(model, ...dependencies)
  ),
}));

const database = new Database();
const model = new Model(database);

model.product.select = jest.fn(async () => entityRowsData);
model.product.description.select = jest.fn(
  async () => entityDescriptionRowsData
);

const factory = new ProductFactory(model);

test("creates a new entity", () => {
  const entity = factory.create();
  expect(entity).toBeInstanceOf(FakeEntity);
});

test("extracts and returns an entity", async () => {
  const entity = await factory.extract({ productId });
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.product.select).toHaveBeenNthCalledWith(1, { productId });
  expect(model.product.description.select).toHaveBeenNthCalledWith(1, {
    productId,
  });
  expect(Product).toHaveBeenNthCalledWith(2, model, productId);
  expect(entity!.data.sortOrder).toBe(123);
  expect(entity!.description[1].name).toBe("test1");
  expect(entity!.description[2].name).toBe("test2");
});

test("extracts all and returns an entities array", async () => {
  const entities = await factory.extractAll({ productId });
  expect(entities).toBeArray();
  const entity = entities[0];
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.product.select).toHaveBeenNthCalledWith(2, { productId });
  expect(model.product.description.select).toHaveBeenNthCalledWith(2, {
    productId,
  });
  expect(Product).toHaveBeenNthCalledWith(3, model, productId);
  expect(entity.data.sortOrder).toBe(123);
  expect(entity.description[1].name).toBe("test1");
  expect(entity.description[2].name).toBe("test2");
});

test("extracts and returns an undefined", async () => {
  model.product.select = jest.fn(async () => []);
  const entity = await factory.extract({ productId: 9999 });
  expect(entity).toBeUndefined();
});

test("extracts all and returns an empty array", async () => {
  const entities = await factory.extractAll({ productId: 9999 });
  expect(entities).toBeArray();
  expect(entities.length).toBe(0);
});
