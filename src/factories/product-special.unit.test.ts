import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import Product from "../entities/product";
import ProductSpecial from "../entities/product-special";
import { initialProductSpecial } from "../initial";
import Model from "../model";
import ProductSpecialFactory from "./product-special";

const productSpecialId = 12;
const productId = 123;

const entityRowsData = [
  {
    ...initialProductSpecial,
    productSpecialId,
    productId,
    price: 123,
    priority: 2,
  },
];

jest.mock("../entities/product-special", () => ({
  __esModule: true,
  default: jest.fn(
    (model, ...dependencies) => new FakeEntity(model, ...dependencies)
  ),
}));

const database = new Database();
const model = new Model(database);

model.product.special.select = jest.fn(async () => entityRowsData);

const factory = new ProductSpecialFactory(model);

test("creates a new entity", () => {
  const entity = factory.create({ id: productId } as Product);
  expect(entity).toBeInstanceOf(FakeEntity);
});

test("extracts and returns an entity", async () => {
  const entity = await factory.extract({ productSpecialId });
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.product.special.select).toHaveBeenNthCalledWith(1, {
    productSpecialId,
  });
  expect(ProductSpecial).toHaveBeenNthCalledWith(2, model, productId);
  expect(entity!.data.price).toBe(entityRowsData[0].price);
});

test("extracts all and returns an entities array", async () => {
  const entities = await factory.extractAll({ productSpecialId });
  expect(entities).toBeArray();
  const entity = entities[0];
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.product.special.select).toHaveBeenNthCalledWith(2, {
    productSpecialId,
  });
  expect(ProductSpecial).toHaveBeenNthCalledWith(3, model, productId);
  expect(entity.data.price).toBe(entityRowsData[0].price);
});

test("extracts and returns an undefined", async () => {
  model.product.special.select = jest.fn(async () => []);
  const entity = await factory.extract({ productSpecialId: 123456 });
  expect(entity).toBeUndefined();
});

test("extracts all and returns an empty array", async () => {
  const entities = await factory.extractAll({ productSpecialId: 123456 });
  expect(entities).toBeArray();
  expect(entities.length).toBe(0);
});
