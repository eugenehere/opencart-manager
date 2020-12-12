import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import Model from "../model";
import OptionFactory from "./option";
import Option from "../entities/option";
import { initialOption, initialOptionDescription } from "../initial";

const optionId = 12;

const entityRowsData = [
  {
    ...initialOption,
    optionId,
    sortOrder: 123,
  },
];

const entityDescriptionRowsData = [
  {
    ...initialOptionDescription,
    optionId,
    languageId: 1,
    name: "test1",
  },
  {
    ...initialOptionDescription,
    optionId,
    languageId: 2,
    name: "test2",
  },
];

jest.mock("../entities/option", () => ({
  __esModule: true,
  default: jest.fn(
    (model, ...dependencies) => new FakeEntity(model, ...dependencies)
  ),
}));

const database = new Database();
const model = new Model(database);

model.option.select = jest.fn(async () => entityRowsData);
model.option.description.select = jest.fn(
  async () => entityDescriptionRowsData
);

const factory = new OptionFactory(model);

test("creates a new entity", () => {
  const entity = factory.create();
  expect(entity).toBeInstanceOf(FakeEntity);
});

test("extracts and returns an entity", async () => {
  const entity = await factory.extract({ optionId });
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.option.select).toHaveBeenNthCalledWith(1, { optionId });
  expect(model.option.description.select).toHaveBeenNthCalledWith(1, {
    optionId,
  });
  expect(Option).toHaveBeenNthCalledWith(
    2,
    model,
    optionId
  );
  expect(entity!.data.sortOrder).toBe(123);
  expect(entity!.description[1].name).toBe("test1");
  expect(entity!.description[2].name).toBe("test2");
});

test("extracts all and returns an entities array", async () => {
  const entities = await factory.extractAll({ optionId });
  expect(entities).toBeArray();
  const entity = entities[0];
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.option.select).toHaveBeenNthCalledWith(2, { optionId });
  expect(model.option.description.select).toHaveBeenNthCalledWith(2, {
    optionId,
  });
  expect(Option).toHaveBeenNthCalledWith(
    3,
    model,
    optionId
  );
  expect(entity.data.sortOrder).toBe(123);
  expect(entity.description[1].name).toBe("test1");
  expect(entity.description[2].name).toBe("test2");
});

test("extracts and returns an undefined", async () => {
  model.option.select = jest.fn(async () => []);
  const entity = await factory.extract({ optionId: 9999 });
  expect(entity).toBeUndefined();
});

test("extracts all and returns an empty array", async () => {
  const entities = await factory.extractAll({ optionId: 9999 });
  expect(entities).toBeArray();
  expect(entities.length).toBe(0);
});
