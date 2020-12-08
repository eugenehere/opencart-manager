export declare global {
  namespace jest {
    interface Matchers<R> {
      toBeResponseHeaders(): R;
      toBeInteger(): R;
      toBeArray(): R;
    }
  }
}
