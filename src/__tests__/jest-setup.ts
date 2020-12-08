import { fakeResultSetHeader } from "../__mocks__/fake-mysql-driver";
import { isInteger } from "../utils";

expect.extend({
  toBeResponseHeaders(received: any) {
    if (received === undefined || received === null) {
      return {
        pass: false,
        message: () =>
          `Received object is null or undefined. Got: ${received}.`,
      };
    }

    if (typeof received.insertId !== "number") {
      return {
        pass: false,
        message: () => `insertId is not a number. Got: ${received.insertId}.`,
      };
    }

    if (typeof received.affectedRows !== "number") {
      return {
        pass: false,
        message: () =>
          `affectedRows is not a number. Got: ${received.affectedRows}.`,
      };
    }

    expect(Object.keys(received)).toEqual(
      expect.arrayContaining(Object.keys(fakeResultSetHeader))
    );

    return {
      pass: true,
      message: () => "",
    };

    // return {
    //   pass: false,
    //   message: () => `The received value is not ResultSetHeader. Got: ${received}`,
    // };
  },

  toBeInteger(received: any) {
    if (isInteger(received)) {
      return {
        pass: true,
        message: () => ``,
      };
    }

    return {
      pass: false,
      message: () => `The received value is not an integer. Got: ${received}.`,
    };
  },

  toBeArray(received: any) {
    if (Array.isArray(received)) {
      return {
        pass: true,
        message: () => ``,
      };
    }

    return {
      pass: false,
      message: () => `The received value is not an array. Got: ${received}.`,
    };
  },
});
