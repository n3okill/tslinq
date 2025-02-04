import { Comparer } from "../../comparer/comparer.ts";
import { validateArgumentOrThrow } from "../../helpers/helpers.ts";
import type { IAsyncEnumerable } from "../../types/async-enumerable.interface.ts";
import type { IEnumerable } from "../../types/enumerable.interface.ts";
import type {
  IOrderedAsyncEnumerable,
  IOrderedEnumerable,
} from "../../types/order.ts";
import type { TKeySelector, TKeySelectorAsync } from "../../types/selectors.ts";
import {
  EnumerableSorter,
  ImplicitlyStableOrderedEnumerable,
  OrderedEnumerableKey,
} from "./order-enumerable.ts";
import {
  ImplicitlyStableOrderedAsyncEnumerable,
  OrderedAsyncEnumerableKey,
} from "./order.async-enumerable.ts";

export function order<T>(
  source: IEnumerable<T>,
  comparer?: Comparer<T> | "string" | "number",
): IOrderedEnumerable<T> {
  return ImplicitlyStableChooser(source, false, comparer);
}

export function orderBy<T, TKey>(
  source: IEnumerable<T>,
  keySelector: TKeySelector<T, TKey>,
  comparer?: Comparer<TKey>,
): IOrderedEnumerable<T> {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new OrderedEnumerableKey(source, keySelector, comparer, false);
}

export function orderDescending<T>(
  source: IEnumerable<T>,
  comparer?: Comparer<T> | "string" | "number",
): IOrderedEnumerable<T> {
  return ImplicitlyStableChooser(source, true, comparer);
}

export function orderByDescending<T, TKey>(
  source: IEnumerable<T>,
  keySelector: TKeySelector<T, TKey>,
  comparer?: Comparer<TKey>,
): IOrderedEnumerable<T> {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new OrderedEnumerableKey(source, keySelector, comparer, true);
}

function ImplicitlyStableChooser<T>(
  source: IEnumerable<T>,
  descending: boolean,
  comparer?: Comparer<T> | "string" | "number",
): IOrderedEnumerable<T> {
  const iterator = source.iterator();
  const first = iterator.next();
  if (first.done) {
    return source as IOrderedEnumerable<T>;
  }

  if (comparer === Comparer.default || comparer === Comparer.defaultString) {
    return new ImplicitlyStableOrderedEnumerable<T>(
      source,
      descending,
      comparer,
    );
  }
  if (comparer === "string" || comparer === "number") {
    return new ImplicitlyStableOrderedEnumerable<T>(
      source,
      descending,
      comparer === "number" ? Comparer.default : Comparer.defaultString,
    );
  }

  return new OrderedEnumerableKey(
    source,
    EnumerableSorter.identityFunc,
    comparer,
    descending,
  );
}

export function orderAsync<T>(
  source: IAsyncEnumerable<T>,
  comparer?: Comparer<T> | "string" | "number",
): IOrderedAsyncEnumerable<T> {
  return ImplicitlyStableChooserAsync(source, false, comparer);
}

export function orderByAsync<T, TKey>(
  source: IAsyncEnumerable<T>,
  keySelector: TKeySelectorAsync<T, TKey>,
  comparer?: Comparer<TKey>,
): IOrderedAsyncEnumerable<T> {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new OrderedAsyncEnumerableKey(source, keySelector, comparer, false);
}

export function orderDescendingAsync<T>(
  source: IAsyncEnumerable<T>,
  comparer?: Comparer<T> | "string" | "number",
): IOrderedAsyncEnumerable<T> {
  return ImplicitlyStableChooserAsync(source, true, comparer);
}

export function orderByDescendingAsync<T, TKey>(
  source: IAsyncEnumerable<T>,
  keySelector: TKeySelectorAsync<T, TKey>,
  comparer?: Comparer<TKey>,
): IOrderedAsyncEnumerable<T> {
  validateArgumentOrThrow(keySelector, "keySelector", "function");
  return new OrderedAsyncEnumerableKey(source, keySelector, comparer, true);
}

function ImplicitlyStableChooserAsync<T>(
  source: IAsyncEnumerable<T>,
  descending: boolean,
  comparer?: Comparer<T> | "string" | "number",
): IOrderedAsyncEnumerable<T> {
  if (comparer === Comparer.default || comparer === Comparer.defaultString) {
    return new ImplicitlyStableOrderedAsyncEnumerable<T>(
      source,
      descending,
      comparer,
    );
  }
  if (comparer === "string" || comparer === "number") {
    return new ImplicitlyStableOrderedAsyncEnumerable<T>(
      source,
      descending,
      comparer === "number" ? Comparer.default : Comparer.defaultString,
    );
  }

  return new OrderedAsyncEnumerableKey(
    source,
    EnumerableSorter.identityFunc,
    comparer,
    descending,
  );
}
