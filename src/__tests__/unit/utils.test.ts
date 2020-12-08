import * as utils from "../../utils";

test("camelCase & snakeCase", () => {
  const snake = "product_id";
  const camel = "productId";
  expect(utils.camelCase(snake)).toBe(camel);
  expect(utils.snakeCase(camel)).toBe(snake);
});

test("camelCasePropertyNames & snakeCasePropertyNames", () => {
  const camel = {
    productId: 1,
    productAttributeId: 1,
    productOptionId: 1,
  };

  const snake = {
    product_id: 1,
    product_attribute_id: 1,
    product_option_id: 1,
  };

  expect(utils.camelCasePropertyNames(snake)).toStrictEqual(camel);
  expect(utils.snakeCasePropertyNames(camel)).toStrictEqual(snake);
});

test("isInteger", () => {
  const number = 1;
  const zero = 0;
  const floatZero = 0.0;
  const float = 1.3;
  const undef = undefined;
  const nullable = null;
  const arrEmpty: any[] = [];
  const arrValues = [1, "", {}, [1, 2], 0.0];
  const obEmpty = {};
  const obValues = {
    a: 1,
    b: [],
    2: "2",
    c: {},
    d: "",
  };
  const boolTrue = true;
  const boolFalse = false;
  expect(utils.isInteger(number)).toBeTruthy();
  expect(utils.isInteger(zero)).toBeTruthy();
  // expect(utils.isInteger(floatZero)).toBeFalsy();
  expect(utils.isInteger(float)).toBeFalsy();
  expect(utils.isInteger(undef)).toBeFalsy();
  expect(utils.isInteger(nullable)).toBeFalsy();
  expect(utils.isInteger(arrEmpty)).toBeFalsy();
  expect(utils.isInteger(arrValues)).toBeFalsy();
  expect(utils.isInteger(obEmpty)).toBeFalsy();
  expect(utils.isInteger(obValues)).toBeFalsy();
  expect(utils.isInteger(boolTrue)).toBeFalsy();
  expect(utils.isInteger(boolFalse)).toBeFalsy();
});

test("toMysqlTimestamp", () => {
  expect(utils.toMysqlTimestamp(0)).toBe("1970-01-01 00:00:00");
  // expect(utils.toMysqlTimestamp(new Date(2015, 0, 11, 20, 59, 5))).toBe('2015-01-11 23:59:05');
});

test("PromisifyDelay", async () => {
  const data = { a: 1 };
  const result = await utils.PromisifyDelay(data, 1000);
  expect(result).toStrictEqual(data);
});

test("toFieldset", () => {
  const notFieldset = {
    date: new Date(0),
    obj: { a: 1, b: [], c: {} },
    arr: [1, "2", [], {}, false],
    num: 123,
    str: "asd",
    bool: true,
    undef: undefined,
    nullable: null,
  };
  const result = utils.toFieldset(notFieldset);
  expect(result).toStrictEqual({
    date: "1970-01-01 00:00:00",
    obj: "[object Object]",
    arr: "1,2,,[object Object],false",
    num: 123,
    str: "asd",
    bool: "true",
    undef: "",
    nullable: "",
  });
});
