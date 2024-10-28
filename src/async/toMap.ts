export const toMap = async <T, TKey>(
  iterator: AsyncIterator<T>,
  keySelector: (x: T) => TKey | Promise<TKey>,
): Promise<Map<TKey, T[]>> => {
  const map = new Map<TKey, Array<T>>();
  let current = await iterator.next();
  loop1: while (current.done !== true) {
    const key = await keySelector(current.value);
    const iteratorMap = map[Symbol.iterator]();
    let currentMap = iteratorMap.next();
    while (currentMap.done !== true) {
      if (currentMap.value[0] === key) {
        currentMap.value[1].push(current.value);
        continue loop1;
      }
      currentMap = iteratorMap.next();
    }
    map.set(key, [current.value]);
    current = await iterator.next();
  }
  return map;
};
