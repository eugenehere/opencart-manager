import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import Model from "../model";
import { initialOptionValue, initialOptionValueDescription } from "../initial";
import OptionValueFactory from "./option-value";
import OptionValue from "../entities/option-value";
import Option from "../entities/option";

const optionValueId = 23;
const optionId = 123;

const entityRowsData = [
  {
    ...initialOptionValue,
    optionValueId,
    optionId,
    sortOrder: 123,
  },
];

const entityDescriptionRowsData = [
  {
    ...initialOptionValueDescription,
    optionValueId,
    languageId: 1,
    name: "test1",
  },
  {
    ...initialOptionValueDescription,
    optionValueId,
    languageId: 2,
    name: "test2",
  },
];

jest.mock("../entities/option-value", () => ({
  __esModule: true,
  default: jest.fn(
    (model, ...dependencies) => new FakeEntity(model, ...dependencies)
  ),
}));

const database = new Database();
const model = new Model(database);

model.option.value.select = jest.fn(async () => entityRowsData);
model.option.value.description.select = jest.fn(
  async () => entityDescriptionRowsData
);

const factory = new OptionValueFactory(model);

test("creates a new entity", () => {
  const entity = factory.create({ id: optionId } as Option);
  expect(entity).toBeInstanceOf(FakeEntity);
});

test("extracts and returns an entity", async () => {
  const entity = await factory.extract({ optionValueId });
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.option.value.select).toHaveBeenNthCalledWith(1, { optionValueId });
  expect(model.option.value.description.select).toHaveBeenNthCalledWith(1, {
    optionValueId,
  });
  expect(OptionValue).toHaveBeenNthCalledWith(
    2,
    model,
    optionId,
    optionValueId
  );
  expect(entity!.data.sortOrder).toBe(123);
  expect(entity!.description[1].name).toBe("test1");
  expect(entity!.description[2].name).toBe("test2");
});

test("extracts all and returns an entities array", async () => {
  const entities = await factory.extractAll({ optionValueId });
  expect(entities).toBeArray();
  const entity = entities[0];
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.option.value.select).toHaveBeenNthCalledWith(2, { optionValueId });
  expect(model.option.value.description.select).toHaveBeenNthCalledWith(2, {
    optionValueId,
  });
  expect(OptionValue).toHaveBeenNthCalledWith(
    3,
    model,
    optionId,
    optionValueId
  );
  expect(entity.data.sortOrder).toBe(123);
  expect(entity.description[1].name).toBe("test1");
  expect(entity.description[2].name).toBe("test2");
});

test("extracts and returns an undefined", async () => {
  model.option.value.select = jest.fn(async () => []);
  const entity = await factory.extract({ optionValueId: 9999 });
  expect(entity).toBeUndefined();
});

test("extracts all and returns an empty array", async () => {
  const entities = await factory.extractAll({ optionValueId: 9999 });
  expect(entities).toBeArray();
  expect(entities.length).toBe(0);
});
