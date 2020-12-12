import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import Model from "../model";
import { initialProductOptionValue } from "../initial";
import ProductOptionValue from "../entities/product-option-value";
import ProductOptionValueFactory from './product-option-value';
import ProductOption from "../entities/product-option";
import OptionValue from "../entities/option-value";

const productOptionValueId = 12;
const productOptionId = 123;
const optionValueId = 134;

const entityRowsData = [
  {
    ...initialProductOptionValue,
    productOptionValueId,
    productOptionId,
    optionValueId,
    price: 123,
  },
];

jest.mock("../entities/product-option-value", () => ({
  __esModule: true,
  default: jest.fn(
    (model, ...dependencies) => new FakeEntity(model, ...dependencies)
  ),
}));

const database = new Database();
const model = new Model(database);

model.product.option.value.select = jest.fn(async () => entityRowsData);

const factory = new ProductOptionValueFactory(model);

test("creates a new entity", () => {
  const entity = factory.create(
    { id: productOptionId } as ProductOption,
    { id: optionValueId } as OptionValue,
  );
  expect(entity).toBeInstanceOf(FakeEntity);
});

test("extracts and returns an entity", async () => {
  const entity = await factory.extract({ productOptionValueId });
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.product.option.value.select).toHaveBeenNthCalledWith(1, { productOptionValueId });
  expect(ProductOptionValue).toHaveBeenNthCalledWith(
    2,
    model,
    productOptionId,
    optionValueId,
    productOptionValueId
  );
  expect(entity!.data.price).toBe(123);
});

test("extracts all and returns an entities array", async () => {
  const entities = await factory.extractAll({ productOptionValueId });
  expect(entities).toBeArray();
  const entity = entities[0];
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.product.option.value.select).toHaveBeenNthCalledWith(2, { productOptionValueId });
  expect(ProductOptionValue).toHaveBeenNthCalledWith(
    3,
    model,
    productOptionId,
    optionValueId,
    productOptionValueId
  );
  expect(entity.data.price).toBe(123);
});

test("extracts and returns an undefined", async () => {
  model.product.option.value.select = jest.fn(async () => []);
  const entity = await factory.extract({ productOptionValueId: 9999 });
  expect(entity).toBeUndefined();
});

test("extracts all and returns an empty array", async () => {
  const entities = await factory.extractAll({ productOptionValueId: 9999 });
  expect(entities).toBeArray();
  expect(entities.length).toBe(0);
});
