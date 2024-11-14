import * as util from "node:util";

export function isUndefined(arg: unknown) {
  return typeof arg === "undefined";
}

export function isNull(arg: unknown) {
  return arg === null;
}

export function isNullOrUndefined(arg: unknown) {
  return isNull(arg) || isUndefined(arg);
}

export function kindOf(arg: unknown) {
  return isNull(arg)
    ? "null"
    : isUndefined(arg)
      ? "undefined"
      : /^\[object (.*)]$/.exec(Object.prototype.toString.call(arg))![1];
}
export function isKind(arg: unknown, kind: string) {
  return kindOf(arg).toLowerCase() === kind.toLowerCase();
}
export function isNumber(arg: unknown) {
  return isKind(arg, "number");
}

export function isFunction(arg: unknown) {
  return isKind(arg, "function");
}

export function isAsyncIterable(arg: unknown) {
  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    !isNullOrUndefined(arg) && isFunction((arg as any)[Symbol.asyncIterator])
  );
}

export function isString(arg: unknown) {
  return isKind(arg, "string");
}

export function isBoolean(arg: unknown) {
  return isKind(arg, "boolean");
}

export function isSymbol(arg: unknown) {
  return isKind(arg, "symbol");
}

export function isObject(arg: unknown) {
  return !isNullOrUndefined(arg) && isKind(arg, "object");
}

export function isIterable(arg: unknown) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return !isNullOrUndefined(arg) && isFunction((arg as any)[Symbol.iterator]);
}

export function isAsyncFunction(arg: unknown) {
  const AsyncFunction = (async () => {
    //empty
  }).constructor;
  if (
    (arg instanceof AsyncFunction && AsyncFunction !== Function) ||
    arg instanceof Promise ||
    ("isAsyncFunction" in util.types && util.types.isAsyncFunction(arg))
  ) {
    return true;
  }
  let promise;
  try {
    promise = (arg as CallableFunction)();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_) {
    //empty
  }
  return promise && isFunction(promise.then) && promise[Symbol.toStringTag] === "Promise";
}

export function isFunctionType(arg: unknown) {
  return isFunction(arg) || isAsyncFunction(arg);
}
