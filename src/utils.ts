import * as changeCase from "change-case";

import { TFieldset } from "./types";

export function toMysqlTimestamp(date: string | number | Date): string {
  return new Date(date).toISOString().slice(0, 19).replace("T", " ");
}

export function toFieldset<T>(data: T[]): Array<TFieldset<T>>; // rename T
export function toFieldset<T>(data: T): TFieldset<T>;
export function toFieldset<T>(
  data: T | T[]
): TFieldset<T> | Array<TFieldset<T>> {
  function convert(obj: T): TFieldset<T> {
    return Object.keys(obj).reduce((acc: any, key: any) => {
      const element = (obj as any)[key];

      if (typeof element === "number") {
        acc[key] = element;
        return acc;
      }

      if (element instanceof Date) {
        acc[key] = toMysqlTimestamp(element);
        return acc;
      }

      if (element === undefined || element === null) {
        acc[key] = "";
        return acc;
      }

      acc[key] = String(element);
      return acc;
    }, {});
  }

  if (Array.isArray(data)) {
    return data.map((object) => convert(object));
  }
  return convert(data);
}

export function convertPropertyNames(
  obj: object,
  callback: (input: string) => string
): object {
  return Object.keys(obj).reduce((acc, key) => {
    (acc as any)[callback(key)] = (obj as any)[key];
    return acc;
  }, {});
}

export function camelCase(input: string) {
  return changeCase.camelCase(input);
}

export function snakeCase(input: string) {
  return changeCase.snakeCase(input);
}

export function camelCasePropertyNames(obj: object): object {
  return convertPropertyNames(obj, camelCase);
}

export function snakeCasePropertyNames(obj: object): object {
  return convertPropertyNames(obj, snakeCase);
}

export function PromisifyDelay<T>(data: T, delay: number): Promise<T> {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(data), delay);
  });
}

export function isInteger(number: any): number is number {
  return Number.isInteger(number);
}
