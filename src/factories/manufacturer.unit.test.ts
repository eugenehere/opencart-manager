import Database from "../__mocks__/database";
import FakeEntity from "../__mocks__/entity";
import Model from "../model";
import { initialManufacturer, initialManufacturerDescription } from "../initial";
import ManufacturerFactory from "./manufacturer";
import Manufacturer from "../entities/manufacturer";

const manufacturerId = 1;

const entityRowsData = [
  {
    ...initialManufacturer,
    manufacturerId,
    sortOrder: 123,
  },
];

const entityDescriptionRowsData = [
  {
    ...initialManufacturerDescription,
    manufacturerId,
    languageId: 1,
    name: "test1",
  },
  {
    ...initialManufacturerDescription,
    manufacturerId,
    languageId: 2,
    name: "test2",
  },
];

jest.mock("../entities/manufacturer", () => ({
  __esModule: true,
  default: jest.fn(
    (model, ...dependencies) => new FakeEntity(model, ...dependencies)
  ),
}));

const database = new Database();
const model = new Model(database);

model.manufacturer.select = jest.fn(async () => entityRowsData);
model.manufacturer.description.select = jest.fn(
  async () => entityDescriptionRowsData
);

const factory = new ManufacturerFactory(model);

test("creates a new entity", () => {
  const entity = factory.create();
  expect(entity).toBeInstanceOf(FakeEntity);
});

test("extracts and returns an entity", async () => {
  const entity = await factory.extract({ manufacturerId });
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.manufacturer.select).toHaveBeenNthCalledWith(1, { manufacturerId });
  expect(model.manufacturer.description.select).toHaveBeenNthCalledWith(1, {
    manufacturerId,
  });
  expect(Manufacturer).toHaveBeenNthCalledWith(
    2,
    model,
    manufacturerId
  );
  expect(entity!.data.sortOrder).toBe(123);
  expect(entity!.description[1].name).toBe("test1");
  expect(entity!.description[2].name).toBe("test2");
});

test("extracts all and returns an entities array", async () => {
  const entities = await factory.extractAll({ manufacturerId });
  expect(entities).toBeArray();
  const entity = entities[0];
  expect(entity).toBeInstanceOf(FakeEntity);
  expect(model.manufacturer.select).toHaveBeenNthCalledWith(2, { manufacturerId });
  expect(model.manufacturer.description.select).toHaveBeenNthCalledWith(2, {
    manufacturerId,
  });
  expect(Manufacturer).toHaveBeenNthCalledWith(
    3,
    model,
    manufacturerId
  );
  expect(entity.data.sortOrder).toBe(123);
  expect(entity.description[1].name).toBe("test1");
  expect(entity.description[2].name).toBe("test2");
});

test("extracts and returns an undefined", async () => {
  model.manufacturer.select = jest.fn(async () => []);
  const entity = await factory.extract({ manufacturerId: 9999 });
  expect(entity).toBeUndefined();
});

test("extracts all and returns an empty array", async () => {
  const entities = await factory.extractAll({ manufacturerId: 9999 });
  expect(entities).toBeArray();
  expect(entities.length).toBe(0);
});
