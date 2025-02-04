/**
 * Represents a function that takes an accumulator and a current value and returns a new accumulator.
 * Used by the aggregate() method to aggregate elements in a sequence.
 *
 * @typeparam T - The type of elements in the sequence.
 * @typeparam TAccumulate - The type of the accumulator value.
 * @param result - The accumulator value.
 * @param current - The current element in the sequence.
 * @returns A new accumulator value.
 */
export type AggregateFunctionType<T, TAccumulate> = (
  result: TAccumulate,
  current: T,
) => TAccumulate;

/**
 * Represents a function that takes an accumulator and returns the final result.
 * Used by the aggregate() method to transform the final accumulator value.
 *
 * @typeparam TAccumulate - The type of the accumulator value.
 * @typeparam TResult - The type of the result.
 * @param result - The accumulator value.
 * @returns The final result.
 */
export type AggregateResultType<TAccumulate, TResult> = (
  result: TAccumulate,
) => TResult;

/**
 * Represents an async function that takes an accumulator and a current value and returns a new accumulator.
 * Used by the aggregate() method to aggregate elements in a sequence.
 *
 * @typeparam T - The type of elements in the sequence.
 * @typeparam TAccumulate - The type of the accumulator value.
 * @param result - The accumulator value.
 * @param current - The current element in the sequence.
 * @returns A new accumulator value, or a Promise that resolves to the new accumulator value.
 */
export type AggregateFunctionTypeAsync<T, TAccumulate> = (
  result: TAccumulate,
  current: T,
) => TAccumulate | Promise<TAccumulate>;

/**
 * Represents an async function that takes an accumulator and returns the final result.
 * Used by the aggregate() method to transform the final accumulator value.
 *
 * @typeparam TAccumulate - The type of the accumulator value.
 * @typeparam TResult - The type of the result.
 * @param result - The accumulator value.
 * @returns The final result, or a Promise that resolves to the final result.
 */
export type AggregateResultTypeAsync<TAccumulate, TResult> = (
  result: TAccumulate,
) => TResult | Promise<TResult>;

/**
 * Represents a function that takes a key and returns an initial accumulator value.
 * Used by the aggregateBy() method to generate the initial accumulator value for each key.
 *
 * @typeparam TKey - The type of the key used to group elements.
 * @typeparam TAccumulate - The type of the accumulator value.
 * @param key - The key of the group.
 * @returns The initial accumulator value.
 */
export type AggregateFunctionSeedSelector<TKey, TAccumulate> = (
  key: TKey,
) => TAccumulate;

/**
 * Represents an async function that takes a key and returns an initial accumulator value.
 * Used by the aggregateBy() method to generate the initial accumulator value for each key.
 *
 * @typeparam TKey - The type of the key used to group elements.
 * @typeparam TAccumulate - The type of the accumulator value.
 * @param key - The key of the group.
 * @returns The initial accumulator value, or a Promise that resolves to the initial accumulator value.
 */
export type AggregateFunctionSeedSelectorAsync<TKey, TAccumulate> = (
  key: TKey,
) => TAccumulate | Promise<TAccumulate>;
