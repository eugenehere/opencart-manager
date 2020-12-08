import Factory from "../../factory";
import opencartManager from "../../index";
import IEntity from "../../interfaces/entity";
import { isInteger } from "../../utils";
import { testDbCredentials } from "../config";

const deleting = true;

let opencart: Factory;
const id: { [K: string]: number } = {};
// const entity: { [K: string]: IEntity } = {};

test("Connecting to database", async () => {
  opencart = await opencartManager(testDbCredentials, {
    tablePrefix: "oc_",
  });
});

test("Create and insert a new product", async () => {
  const product = opencart.product.create();
  expect(product.id).toBeUndefined();
  product.setData({ price: 1212 });
  product.setDescription({ languageId: 1, name: "тестовый продукт" });
  product.setDescription({ languageId: 2, name: "test product" });
  await product.insert();
  expect(product.id).toBeInteger();
  expect(product.data.price).toBe(1212);
  expect(product.description[1].name).toBe("тестовый продукт");
  expect(product.description[2].name).toBe("test product");
  id.product = product.id!;
});

test("Create and insert a new category", async () => {
  const category = opencart.category.create();
  expect(category.id).toBeUndefined();
  category.setData({ image: "test/image.png" });
  category.setDescription({ languageId: 1, name: "тестовая категория" });
  category.setDescription({ languageId: 2, name: "test category" });
  await category.insert();
  expect(category.id).toBeInteger();
  expect(category.data.image).toBe("test/image.png");
  expect(category.description[1].name).toBe("тестовая категория");
  expect(category.description[2].name).toBe("test category");
  id.category = category.id!;
});

test("Create and insert a new option", async () => {
  const option = opencart.option.create();
  expect(option.id).toBeUndefined();
  option.setData({ type: "select" });
  option.setDescription({ languageId: 1, name: "тестовая опция" });
  option.setDescription({ languageId: 2, name: "test option" });
  await option.insert();
  expect(option.id).toBeInteger();
  expect(option.data.type).toBe("select");
  expect(option.description[1].name).toBe("тестовая опция");
  expect(option.description[2].name).toBe("test option");
  id.option = option.id!;
});

test("Create and insert a new option value", async () => {
  const option = await opencart.option.extract({ optionId: id.option });
  expect(option?.id).toBeInteger();
  const optionValue = opencart.option.value.create(option!);
  expect(optionValue.id).toBeUndefined();
  optionValue.setData({ image: "test/image.png" });
  optionValue.setDescription({ languageId: 1, name: "значение тест опции" });
  optionValue.setDescription({ languageId: 2, name: "test option value" });
  await optionValue.insert();
  expect(optionValue.id).toBeInteger();
  expect(optionValue.data.image).toBe("test/image.png");
  expect(optionValue.description[1].name).toBe("значение тест опции");
  expect(optionValue.description[2].name).toBe("test option value");
  id.optionValue = optionValue.id!;
});

test("Create and insert a new attribute group", async () => {
  const attributeGroup = opencart.attribute.group.create();
  expect(attributeGroup.id).toBeUndefined();
  attributeGroup.setData({ sortOrder: 12 });
  attributeGroup.setDescription({ languageId: 1, name: "группа аттрибутов" });
  attributeGroup.setDescription({ languageId: 2, name: "attribute group" });
  await attributeGroup.insert();
  expect(attributeGroup.id).toBeInteger();
  expect(attributeGroup.data.sortOrder).toBe(12);
  expect(attributeGroup.description[1].name).toBe("группа аттрибутов");
  expect(attributeGroup.description[2].name).toBe("attribute group");
  id.attributeGroup = attributeGroup.id!;
});

test("Create and insert a new attribute", async () => {
  const attributeGroup = await opencart.attribute.group.extract({
    attributeGroupId: id.attributeGroup,
  });
  expect(attributeGroup?.id).toBe(id.attributeGroup);
  const attribute = opencart.attribute.create(attributeGroup!);
  expect(attribute.id).toBeUndefined();
  attribute.setData({ sortOrder: 14 });
  attribute.setDescription({ languageId: 1, name: "тестовый аттрибут" });
  attribute.setDescription({ languageId: 2, name: "test attribute" });
  await attribute.insert();
  expect(attribute.id).toBeInteger();
  expect(attribute!.data.sortOrder).toBe(14);
  expect(attribute!.description[1].name).toBe("тестовый аттрибут");
  expect(attribute!.description[2].name).toBe("test attribute");
  id.attribute = attribute.id!;
});

test("Create and insert a new manufacturer", async () => {
  const manufacturer = opencart.manufacturer.create();
  expect(manufacturer.id).toBeUndefined();
  manufacturer.setData({ name: "Производитель тест" });
  manufacturer.setDescription({ languageId: 1, name: "Производитель тест" });
  manufacturer.setDescription({ languageId: 2, name: "Test manufacturer" });
  await manufacturer.insert();
  expect(manufacturer.id).toBeInteger();
  expect(manufacturer!.data.name).toBe("Производитель тест");
  expect(manufacturer!.description[1].name).toBe("Производитель тест");
  expect(manufacturer!.description[2].name).toBe("Test manufacturer");
  id.manufacturer = manufacturer.id!;
});

test("Attach category to product", async () => {
  const category = await opencart.category.extract({
    categoryId: id.category,
  });
  const product = await opencart.product.extract({ productId: id.product });
  expect(category?.id).toBe(id.category);
  expect(product?.id).toBe(id.product);
  await product!.toCategory(category!);
  expect(product!.id).toBe(id.product);
  expect(category!.id).toBe(id.category);
});

test("Attach attribute to product", async () => {
  const attribute = await opencart.attribute.extract({
    attributeId: id.attribute,
  });
  const product = await opencart.product.extract({ productId: id.product });
  expect(attribute?.id).toBe(id.attribute);
  expect(product?.id).toBe(id.product);
  await product!.setAttribute(attribute!, {
    languageId: 1,
    text: "100ГБ тест",
  });
  await product!.setAttribute(attribute!, {
    languageId: 2,
    text: "100Gb test",
  });
  expect(product!.id).toBe(id.product);
});

test("Create and insert an option to product attachment", async () => {
  const product = await opencart.product.extract({ productId: id.product });
  const option = await opencart.option.extract({ optionId: id.option });
  expect(product?.id).toBe(id.product);
  expect(option?.id).toBe(id.option);
  const productOption = await opencart.product.option
    .create(product!, option!)
    .insert();
  productOption.setData({ required: 0 });
  await productOption.update();
  expect(productOption.data.required).toBe(0);
  expect(productOption.id).toBeInteger();
  id.productOption = productOption.id!;
});

test("Create and insert an option value to product option attachment", async () => {
  const productOption = await opencart.product.option.extract({
    productOptionId: id.productOption,
  });
  const optionValue = await opencart.option.value.extract({
    optionValueId: id.optionValue,
  });
  expect(productOption?.id).toBe(id.productOption);
  expect(optionValue?.id).toBe(id.optionValue);
  const productOptionValue = await opencart.product.option.value.create(
    productOption!,
    optionValue!
  );
  productOptionValue.setData({ price: 222 });
  await productOptionValue.insert();
  expect(productOptionValue.id).toBeInteger();
  expect(productOptionValue.data.price).toBe(222);
  id.productOptionValue = productOptionValue.id!;
});

test("", () => {});

if (deleting) {
  test("Extract and delete an attribute", async () => {
    const attribute = await opencart.attribute.extract({
      attributeId: id.attribute,
    });
    expect(attribute?.id).toBe(id.attribute);
    await attribute!.delete();
    expect(attribute!.id).toBeUndefined();
  });

  test("Extract and delete an attribute group", async () => {
    const attributeGroup = await opencart.attribute.group.extract({
      attributeGroupId: id.attributeGroup,
    });
    expect(attributeGroup?.id).toBe(id.attributeGroup);
    await attributeGroup!.delete();
    expect(attributeGroup!.id).toBeUndefined();
  });

  test("Extract and delete a product", async () => {
    const product = await opencart.product.extract({
      productId: id.product,
    });
    expect(product?.id).toBe(id.product);
    await product!.delete();
    expect(product!.id).toBeUndefined();
  });

  test("Extract and delete a category", async () => {
    const category = await opencart.category.extract({
      categoryId: id.category,
    });
    expect(category?.id).toBe(id.category);
    await category!.delete();
    expect(category!.id).toBeUndefined();
  });

  test("Extract and delete an option value to product option attachment", async () => {
    const productOptionValue = await opencart.product.option.value.extract({
      productOptionValueId: id.productOptionValue,
    });
    expect(productOptionValue?.id).toBe(id.productOptionValue);
    await productOptionValue!.delete();
    expect(productOptionValue!.id).toBeUndefined();
  });

  test("Extract and delete an option to product attachment", async () => {
    const productOption = await opencart.product.option.extract({
      productOptionId: id.productOption,
    });
    expect(productOption?.id).toBe(id.productOption);
    await productOption!.delete();
    expect(productOption!.id).toBeUndefined();
  });

  test("Extract and delete an option value", async () => {
    const optionValue = await opencart.option.value.extract({
      optionValueId: id.optionValue,
    });
    expect(optionValue?.id).toBe(id.optionValue);
    await optionValue!.delete();
    expect(optionValue!.id).toBeUndefined();
  });

  test("Extract and delete an option", async () => {
    const option = await opencart.option.extract({ optionId: id.option });
    expect(option!.id).toBe(id.option);
    await option!.delete();
    expect(option!.id).toBeUndefined();
  });

  test("Extract and delete manufacturer", async () => {
    const manufacturer = await opencart.manufacturer.extract({
      manufacturerId: id.manufacturer,
    });
    expect(manufacturer!.id).toBe(id.manufacturer);
    await manufacturer!.delete();
    expect(manufacturer!.id).toBeUndefined();
  });
}

test("Close the connection", async () => {
  opencart.destroyConnection();
});
