import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import Option from "../entities/option";
import Product from "../entities/product";
import ProductOption from "../entities/product-option";
import { initialProductOption } from "../initial";
import Model from "../model";
import ProductOptionFactory from "./product-option";

const productOptionId = 123;
const optionId = 134;
const productId = 134;

const entityRowsData = [
  {
    ...initialProductOption,
    productOptionId,
    optionId,
    productId,
    value: "test value",
  },
];

jest.mock("../entities/product-option", () => ({
  __esModule: true,
  default: jest.fn(
    (model, ...dependencies) => new FakeEntity(model, ...dependencies)
  ),
}));

const database = new Database();
const model = new Model(database);

model.product.option.select = jest.fn(async () => entityRowsData);

const factory = new ProductOptionFactory(model);

test("creates a new entity", () => {
  const entity = factory.create(
    { id: productId } as Product,
    { id: optionId } as Option
  );
  expect(entity).toBeInstanceOf(FakeEntity);
});

test("extracts and returns an entity", async () => {
  const entity = await factory.extract({ productOptionId });
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.product.option.select).toHaveBeenNthCalledWith(1, {
    productOptionId,
  });
  expect(ProductOption).toHaveBeenNthCalledWith(
    2,
    model,
    productId,
    optionId,
    productOptionId
  );
  expect(entity!.data.value).toBe("test value");
});

test("extracts all and returns an entities array", async () => {
  const entities = await factory.extractAll({ productOptionId });
  expect(entities).toBeArray();
  const entity = entities[0];
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.product.option.select).toHaveBeenNthCalledWith(2, {
    productOptionId,
  });
  expect(ProductOption).toHaveBeenNthCalledWith(
    3,
    model,
    productId,
    optionId,
    productOptionId
  );
  expect(entity.data.value).toBe("test value");
});

test("extracts and returns an undefined", async () => {
  model.product.option.select = jest.fn(async () => []);
  const entity = await factory.extract({ productOptionId: 9999 });
  expect(entity).toBeUndefined();
});

test("extracts all and returns an empty array", async () => {
  const entities = await factory.extractAll({ productOptionId: 9999 });
  expect(entities).toBeArray();
  expect(entities.length).toBe(0);
});
