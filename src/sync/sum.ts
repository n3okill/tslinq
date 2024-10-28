import { Exceptions } from "../internal";

type SumType = number | string;
export const sum = <T>(iterator: Iterator<T>, selector: (element: T) => SumType): SumType => {
  let current = iterator.next();
  if (current.done) {
    throw Exceptions.ThrowNoElementsException;
  }
  let result = selector(current.value);
  current = iterator.next();
  while (current.done !== true) {
    if (typeof result === "number") {
      result += selector(current.value) as number;
    } else {
      result += selector(current.value);
    }
    current = iterator.next();
  }
  return result;
};
