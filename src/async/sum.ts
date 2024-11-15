import { Exceptions } from "../internal";

type SumType = number | string;
export const sum = async <T>(
  iterator: AsyncIterator<T>,
  selector: (element: T) => SumType | Promise<SumType>,
): Promise<SumType> => {
  let current = await iterator.next();
  if (current.done) {
    throw Exceptions.ThrowNoElementsException;
  }
  let result = await selector(current.value);
  current = await iterator.next();
  while (current.done !== true) {
    if (typeof result === "number") {
      result += (await selector(current.value)) as number;
    } else {
      result += await selector(current.value);
    }
    current = await iterator.next();
  }
  return result;
};
