import {
  Enumerable,
  AsyncEnumerable,
  NoElementsException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Aggregate", function () {
  const simpleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  describe("Enumerable", function () {
    test("basic sum aggregation", () => {
      const numbers = Enumerable.create([1, 2, 3, 4, 5]);
      const sum = numbers.aggregate((acc, curr) => acc + curr);
      assert.equal(sum, 15);
    });
    test("with seed value", () => {
      const numbers = Enumerable.create([1, 2, 3]);
      const sum = numbers.aggregate((acc, curr) => acc + curr, 10);
      assert.equal(sum, 16);
    });
    test("simple plus number aggregate", function () {
      assert.strictEqual(
        Enumerable.create(simpleArray).aggregate((a, b) => a + b),
        55,
      );
    });
    test("with result selector", () => {
      const numbers = Enumerable.create([1, 2, 3]);
      const result = numbers.aggregate(
        (acc, curr) => acc + curr,
        0,
        (total) => `Sum is ${total}`,
      );
      assert.equal(result, "Sum is 6");
    });
    test("repeated calls", function () {
      const e = Enumerable.create(simpleArray);
      assert.deepStrictEqual(
        e.aggregate((a, b) => a + b),
        e.aggregate((a, b) => a + b),
      );
    });
    test("simple multiply number aggregate", function () {
      assert.strictEqual(
        Enumerable.create(simpleArray).aggregate((a, b) => a * b),
        3628800,
      );
    });
    test("transform aggregate", function () {
      const val = Enumerable.create(simpleArray).aggregate(
        (a, b) => a * b,
        1,
        (o) => o / 2,
      );
      assert.strictEqual(val, 1814400);
    });
    test("defaultValue 'string' aggregate", function () {
      const val = Enumerable.create([1, 2, 3]).aggregate(
        (a, b) => `${a.toString()}${b.toString()}`,
        "",
      );
      assert.strictEqual(val, "123");
    });
    test("single element", function () {
      assert.strictEqual(
        Enumerable.create([5]).aggregate((x, y) => x + y),
        5,
      );
    });
    test("empty source and seed", function () {
      assert.strictEqual(
        Enumerable.create([]).aggregate((x, y) => x * y, 2),
        2,
      );
    });
    test("single element and seed", function () {
      assert.strictEqual(
        Enumerable.create([5]).aggregate((x, y) => x * y, 2),
        10,
      );
    });
    test("two elements and seed", function () {
      assert.strictEqual(
        Enumerable.create([5, 6]).aggregate((x, y) => x * y, 2),
        60,
      );
    });
    test("no elements seed and result selector", function () {
      assert.strictEqual(
        Enumerable.create([]).aggregate(
          (x, y) => x * y,
          2,
          (x) => x + 5,
        ),
        7,
      );
    });
    test("single element seed and result selector", function () {
      assert.strictEqual(
        Enumerable.create([5]).aggregate(
          (x, y) => x * y,
          2,
          (x) => x + 5,
        ),
        15,
      );
    });
    test("two elements seed and result selector", function () {
      assert.strictEqual(
        Enumerable.create([5, 6]).aggregate(
          (x, y) => x * y,
          2,
          (x) => x + 5,
        ),
        65,
      );
    });
    test("Basic", function () {
      assert.strictEqual(
        Enumerable.create(["f", "o", "o"]).aggregate((x, y) => x + y),
        "foo",
      );

      const sentence = "the quick brown fox jumps over the lazy dog";
      // Split the string into individual words.
      const words = Enumerable.create(sentence.split(" "));
      // Prepend each word to the beginning of the
      // new sentence to reverse the word order.
      const reversed = words.aggregate(
        (workingSentence, next) => next + " " + workingSentence,
      );
      assert.strictEqual(
        reversed,
        "dog lazy the over jumps fox brown quick the",
      );
    });
    test("String", function () {
      assert.strictEqual(
        Enumerable.create("thisisthemostboringpartofcoding").aggregate(
          (x, y) => x + y,
        ),
        "thisisthemostboringpartofcoding",
      );
    });
    test("ResultSelector", function () {
      const fruits = Enumerable.create([
        "apple",
        "mango",
        "orange",
        "passionfruit",
        "grape",
      ]);

      // Determine whether any string in the array is longer than "banana".
      const longestName = fruits.aggregate(
        (longest, next) => (next.length > longest.length ? next : longest),
        "banana",
        // Return the final result as an upper case string.
        (fruit) => fruit.toUpperCase(),
      );

      assert.strictEqual(longestName, "PASSIONFRUIT");
    });

    test("Exception", function () {
      assert.throws(
        () => Enumerable.create<number>([]).aggregate((x, y) => x + y),
        NoElementsException,
      );
    });
  });

  describe("AsyncEnumerable", function () {
    test("basic async sum aggregation", async () => {
      const numbers = AsyncEnumerable.create([1, 2, 3, 4, 5]);
      const sum = await numbers.aggregate(async (acc, curr) => acc + curr);
      assert.equal(sum, 15);
    });

    test("async with seed value", async () => {
      const numbers = AsyncEnumerable.create([1, 2, 3]);
      const sum = await numbers.aggregate(async (acc, curr) => acc + curr, 10);
      assert.equal(sum, 16);
    });
    test("simple plus number aggregate", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create(simpleArray).aggregate((a, b) => a + b),
        55,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(simpleArray);
      assert.deepStrictEqual(
        await e.aggregate((a, b) => a + b),
        await e.aggregate((a, b) => a + b),
      );
    });
    test("simple multiply number aggregate", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create(simpleArray).aggregate((a, b) => a * b),
        3628800,
      );
    });
    test("async with result selector", async () => {
      const numbers = AsyncEnumerable.create([1, 2, 3]);
      const result = await numbers.aggregate(
        async (acc, curr) => acc + curr,
        0,
        async (total) => `Sum is ${total}`,
      );
      assert.equal(result, "Sum is 6");
    });
    test("transform aggregate", async function () {
      const val = await AsyncEnumerable.create(simpleArray).aggregate(
        (a, b) => a * b,
        1,
        (o) => o / 2,
      );
      assert.strictEqual(val, 1814400);
    });
    test("defaultValue 'string' aggregate", async function () {
      const val = await AsyncEnumerable.create([1, 2, 3]).aggregate(
        (a, b) => `${a.toString()}${b.toString()}`,
        "",
      );
      assert.strictEqual(val, "123");
    });
    test("single element", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([5]).aggregate((x, y) => x + y),
        5,
      );
    });
    test("empty source and seed", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([]).aggregate((x, y) => x * y, 2),
        2,
      );
    });
    test("single element and seed", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([5]).aggregate((x, y) => x * y, 2),
        10,
      );
    });
    test("two elements and seed", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([5, 6]).aggregate((x, y) => x * y, 2),
        60,
      );
    });
    test("no elements seed and result selector", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([]).aggregate(
          (x, y) => x * y,
          2,
          (x) => x + 5,
        ),
        7,
      );
    });
    test("single element seed and result selector", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([5]).aggregate(
          (x, y) => x * y,
          2,
          (x) => x + 5,
        ),
        15,
      );
    });
    test("two elements seed and result selector", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([5, 6]).aggregate(
          (x, y) => x * y,
          2,
          (x) => x + 5,
        ),
        65,
      );
    });
    test("Basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create(["f", "o", "o"]).aggregate(
          (x, y) => x + y,
        ),
        "foo",
      );

      const sentence = "the quick brown fox jumps over the lazy dog";
      // Split the string into individual words.
      const words = AsyncEnumerable.create(sentence.split(" "));
      // Prepend each word to the beginning of the
      // new sentence to reverse the word order.
      const reversed = await words.aggregate(
        (workingSentence, next) => next + " " + workingSentence,
      );
      assert.strictEqual(
        reversed,
        "dog lazy the over jumps fox brown quick the",
      );
    });
    test("ResultSelector", async function () {
      const fruits = AsyncEnumerable.create([
        "apple",
        "mango",
        "orange",
        "passionfruit",
        "grape",
      ]);

      // Determine whether any string in the array is longer than "banana".
      const longestName = await fruits.aggregate(
        (longest, next) => (next.length > longest.length ? next : longest),
        "banana",
        // Return the final result as an upper case string.
        (fruit) => fruit.toUpperCase(),
      );

      assert.strictEqual(longestName, "PASSIONFRUIT");
    });
    test("Exception", async function () {
      await assert.rejects(
        AsyncEnumerable.create<number>([]).aggregate((x, y) => x + y),
        NoElementsException,
      );
    });
  });
  describe("AsyncEnumerable async accumulator and selector", function () {
    test("simple plus number aggregate", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create(simpleArray).aggregate(async (a, b) =>
          Promise.resolve(a + b),
        ),
        55,
      );
    });
    test("repeated calls", async function () {
      assert.deepStrictEqual(
        await AsyncEnumerable.create(simpleArray).aggregate(async (a, b) =>
          Promise.resolve(a + b),
        ),
        await AsyncEnumerable.create(simpleArray).aggregate(async (a, b) =>
          Promise.resolve(a + b),
        ),
      );
    });
    test("simple multiply number aggregate", async function () {
      const val = await AsyncEnumerable.create(simpleArray).aggregate(
        async (a, b) => Promise.resolve(a * b),
      );
      assert.strictEqual(val, 3628800);
    });
    test("transform aggregate", async function () {
      const val = await AsyncEnumerable.create(simpleArray).aggregate(
        async (a, b) => Promise.resolve(a * b),
        1,
        async (o) => Promise.resolve(o / 2),
      );
      assert.strictEqual(val, 1814400);
    });
    test("defaultValue 'string' aggregate", async function () {
      const val = await AsyncEnumerable.create([1, 2, 3]).aggregate(
        async (a, b) => Promise.resolve(`${a.toString()}${b.toString()}`),
        "",
      );
      assert.strictEqual(val, "123");
    });
    test("single element", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([5]).aggregate(async (x, y) =>
          Promise.resolve(x + y),
        ),
        5,
      );
    });
    test("empty source and seed", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([]).aggregate(
          async (x, y) => Promise.resolve(x * y),
          2,
        ),
        2,
      );
    });
    test("single element and seed", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([5]).aggregate(
          async (x, y) => Promise.resolve(x * y),
          2,
        ),
        10,
      );
    });
    test("two elements and seed", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([5, 6]).aggregate(
          async (x, y) => Promise.resolve(x * y),
          2,
        ),
        60,
      );
    });
    test("no elements seed and result selector", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([]).aggregate(
          async (x, y) => Promise.resolve(x * y),
          2,
          async (x) => Promise.resolve(x + 5),
        ),
        7,
      );
    });
    test("single element seed and result selector", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([5]).aggregate(
          async (x, y) => Promise.resolve(x * y),
          2,
          async (x) => Promise.resolve(x + 5),
        ),
        15,
      );
    });
    test("two elements seed and result selector", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([5, 6]).aggregate(
          async (x, y) => Promise.resolve(x * y),
          2,
          async (x) => Promise.resolve(x + 5),
        ),
        65,
      );
    });
    test("Basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create(["f", "o", "o"]).aggregate(async (x, y) =>
          Promise.resolve(x + y),
        ),
        "foo",
      );

      const sentence = "the quick brown fox jumps over the lazy dog";
      // Split the string into individual words.
      const words = AsyncEnumerable.create(sentence.split(" "));
      // Prepend each word to the beginning of the
      // new sentence to reverse the word order.
      const reversed = await words.aggregate(async (workingSentence, next) =>
        Promise.resolve(next + " " + workingSentence),
      );
      assert.strictEqual(
        reversed,
        "dog lazy the over jumps fox brown quick the",
      );
    });
    test("ResultSelector", async function () {
      const fruits = AsyncEnumerable.create([
        "apple",
        "mango",
        "orange",
        "passionfruit",
        "grape",
      ]);

      // Determine whether any string in the array is longer than "banana".
      const longestName = await fruits.aggregate(
        async (longest, next) =>
          Promise.resolve(next.length > longest.length ? next : longest),
        "banana",
        // Return the final result as an upper case string.
        async (fruit) => Promise.resolve(fruit.toUpperCase()),
      );

      assert.strictEqual(longestName, "PASSIONFRUIT");
    });
    test("Exception", async function () {
      await assert.rejects(
        AsyncEnumerable.create<number>([]).aggregate(async (x, y) =>
          Promise.resolve(x + y),
        ),
        NoElementsException,
      );
    });
  });
});
