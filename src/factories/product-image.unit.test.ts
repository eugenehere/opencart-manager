import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import Product from "../entities/product";
import ProductImage from "../entities/product-image";
import { initialProductImage } from "../initial";
import Model from "../model";
import ProductImageFactory from "./product-image";

const productImageId = 12;
const productId = 123;

const entityRowsData = [
  {
    ...initialProductImage,
    productImageId,
    productId,
    image: "path/to/image",
    sortOrder: 1,
  },
];

jest.mock("../entities/product-image", () => ({
  __esModule: true,
  default: jest.fn(
    (model, ...dependencies) => new FakeEntity(model, ...dependencies)
  ),
}));

const database = new Database();
const model = new Model(database);

model.product.image.select = jest.fn(async () => entityRowsData);

const factory = new ProductImageFactory(model);

test("creates a new entity", () => {
  const entity = factory.create({ id: productId } as Product);
  expect(entity).toBeInstanceOf(FakeEntity);
});

test("extracts and returns an entity", async () => {
  const entity = await factory.extract({ productImageId });
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.product.image.select).toHaveBeenNthCalledWith(1, {
    productImageId,
  });
  expect(ProductImage).toHaveBeenNthCalledWith(2, model, productId);
  expect(entity!.data.image).toBe(entityRowsData[0].image);
});

test("extracts all and returns an entities array", async () => {
  const entities = await factory.extractAll({ productImageId });
  expect(entities).toBeArray();
  const entity = entities[0];
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.product.image.select).toHaveBeenNthCalledWith(2, {
    productImageId,
  });
  expect(ProductImage).toHaveBeenNthCalledWith(3, model, productId);
  expect(entity.data.image).toBe(entityRowsData[0].image);
});

test("extracts and returns an undefined", async () => {
  model.product.image.select = jest.fn(async () => []);
  const entity = await factory.extract({ productImageId: 123456 });
  expect(entity).toBeUndefined();
});

test("extracts all and returns an empty array", async () => {
  const entities = await factory.extractAll({ productImageId: 123456 });
  expect(entities).toBeArray();
  expect(entities.length).toBe(0);
});
