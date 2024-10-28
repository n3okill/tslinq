export const toMap = <T, TKey>(iterator: Iterator<T>, keySelector: (x: T) => TKey): Map<TKey, Array<T>> => {
  const map = new Map<TKey, Array<T>>();
  let current = iterator.next();
  loop1: while (current.done !== true) {
    const key = keySelector(current.value);
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
    current = iterator.next();
  }
  return map;
};
