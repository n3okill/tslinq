import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Aggregate", function () {
  const simpleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  describe("Enumerable", function () {
    test("simple plus number aggregate", function () {
      const val = Enumerable.asEnumerable(simpleArray).aggregate((a, b) => a + b);
      assert.strictEqual(val, 55);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(simpleArray);
      assert.deepStrictEqual(
        e.aggregate((a, b) => a + b),
        e.aggregate((a, b) => a + b),
      );
    });
    test("simple multiply number aggregate", function () {
      const val = Enumerable.asEnumerable(simpleArray).aggregate((a, b) => a * b);
      assert.strictEqual(val, 3628800);
    });
    test("transform aggregate", function () {
      const val = Enumerable.asEnumerable(simpleArray).aggregate(
        1,
        (a, b) => a * b,
        (o) => o / 2,
      );
      assert.strictEqual(val, 1814400);
    });
    test("defaultValue 'string' aggregate", function () {
      const val = Enumerable.asEnumerable([1, 2, 3]).aggregate(
        "",
        (a: unknown, b: unknown) => `${(a as number).toString()}${(b as number).toString()}`,
      );
      assert.strictEqual(val, "123");
    });
    test("single element", function () {
      assert.strictEqual(
        Enumerable.asEnumerable([5]).aggregate((x, y) => x + y),
        5,
      );
    });
    test("empty source and seed", function () {
      assert.strictEqual(
        Enumerable.asEnumerable([]).aggregate(2, (x, y) => x * y),
        2,
      );
    });
    test("single element and seed", function () {
      assert.strictEqual(
        Enumerable.asEnumerable([5]).aggregate(2, (x, y) => x * y),
        10,
      );
    });
    test("two elements and seed", function () {
      assert.strictEqual(
        Enumerable.asEnumerable([5, 6]).aggregate(2, (x, y) => x * y),
        60,
      );
    });
    test("no elements seed and result selector", function () {
      assert.strictEqual(
        Enumerable.asEnumerable([]).aggregate(
          2,
          (x, y) => x * y,
          (x) => x + 5,
        ),
        7,
      );
    });
    test("single element seed and result selector", function () {
      assert.strictEqual(
        Enumerable.asEnumerable([5]).aggregate(
          2,
          (x, y) => x * y,
          (x) => x + 5,
        ),
        15,
      );
    });
    test("two elements seed and result selector", function () {
      assert.strictEqual(
        Enumerable.asEnumerable([5, 6]).aggregate(
          2,
          (x, y) => x * y,
          (x) => x + 5,
        ),
        65,
      );
    });
    test("Basic", function () {
      assert.strictEqual(
        Enumerable.asEnumerable(["f", "o", "o"]).aggregate((x, y) => x + y),
        "foo",
      );

      const sentence = "the quick brown fox jumps over the lazy dog";
      // Split the string into individual words.
      const words = Enumerable.asEnumerable(sentence.split(" "));
      // Prepend each word to the beginning of the
      // new sentence to reverse the word order.
      const reversed = words.aggregate((workingSentence, next) => next + " " + workingSentence);
      assert.strictEqual(reversed, "dog lazy the over jumps fox brown quick the");
    });
    test("String", function () {
      assert.strictEqual(
        Enumerable.asEnumerable("thisisthemostboringpartofcoding").aggregate((x, y) => x + y),
        "thisisthemostboringpartofcoding",
      );
    });
    test("ResultSelector", function () {
      const fruits = Enumerable.asEnumerable(["apple", "mango", "orange", "passionfruit", "grape"]);

      // Determine whether any string in the array is longer than "banana".
      const longestName = fruits.aggregate(
        "banana",
        (longest, next) => (next.length > longest.length ? next : longest),
        // Return the final result as an upper case string.
        (fruit) => fruit.toUpperCase(),
      );

      assert.strictEqual(longestName, "PASSIONFRUIT");
    });

    test("Exception", function () {
      assert.throws(
        () => Enumerable.asEnumerable<number>([]).aggregate((x, y) => x + y),
        Exceptions.ThrowNoElementsException,
      );
    });
  });

  describe("EnumerableAsync", function () {
    test("simple plus number aggregate", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate((a, b) => a + b), 55);
    });
    test("repeated calls", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate((a, b) => a + b),
        await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate((a, b) => a + b),
      );
    });
    test("simple multiply number aggregate", async function () {
      const val = await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate((a, b) => a * b);
      assert.strictEqual(val, 3628800);
    });
    test("transform aggregate", async function () {
      const val = await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(
        1,
        (a, b) => a * b,
        (o) => o / 2,
      );
      assert.strictEqual(val, 1814400);
    });
    test("defaultValue 'string' aggregate", async function () {
      const val = await EnumerableAsync.asEnumerableAsync([1, 2, 3]).aggregate(
        "",
        (a: unknown, b: unknown) => `${(a as number).toString()}${(b as number).toString()}`,
      );
      assert.strictEqual(val, "123");
    });
    test("single element", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([5]).aggregate((x, y) => x + y), 5);
    });
    test("empty source and seed", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([]).aggregate(2, (x, y) => x * y), 2);
    });
    test("single element and seed", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([5]).aggregate(2, (x, y) => x * y), 10);
    });
    test("two elements and seed", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([5, 6]).aggregate(2, (x, y) => x * y), 60);
    });
    test("no elements seed and result selector", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([]).aggregate(
          2,
          (x, y) => x * y,
          (x) => x + 5,
        ),
        7,
      );
    });
    test("single element seed and result selector", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([5]).aggregate(
          2,
          (x, y) => x * y,
          (x) => x + 5,
        ),
        15,
      );
    });
    test("two elements seed and result selector", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([5, 6]).aggregate(
          2,
          (x, y) => x * y,
          (x) => x + 5,
        ),
        65,
      );
    });
    test("Basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync(["f", "o", "o"]).aggregate((x, y) => x + y), "foo");

      const sentence = "the quick brown fox jumps over the lazy dog";
      // Split the string into individual words.
      const words = EnumerableAsync.asEnumerableAsync(sentence.split(" "));
      // Prepend each word to the beginning of the
      // new sentence to reverse the word order.
      const reversed = await words.aggregate((workingSentence, next) => next + " " + workingSentence);
      assert.strictEqual(reversed, "dog lazy the over jumps fox brown quick the");
    });
    test("ResultSelector", async function () {
      const fruits = EnumerableAsync.asEnumerableAsync(["apple", "mango", "orange", "passionfruit", "grape"]);

      // Determine whether any string in the array is longer than "banana".
      const longestName = await fruits.aggregate(
        "banana",
        (longest, next) => (next.length > longest.length ? next : longest),
        // Return the final result as an upper case string.
        (fruit) => fruit.toUpperCase(),
      );

      assert.strictEqual(longestName, "PASSIONFRUIT");
    });
    test("Exception", async function () {
      assert.rejects(
        EnumerableAsync.asEnumerableAsync<number>([]).aggregate((x, y) => x + y),
        Exceptions.ThrowNoElementsException,
      );
    });
  });
  describe("EnumerableAsync async accumulator and selector", function () {
    test("simple plus number aggregate", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(async (a, b) => Promise.resolve(a + b)),
        55,
      );
    });
    test("repeated calls", async function () {
      assert.deepStrictEqual(
        await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(async (a, b) => Promise.resolve(a + b)),
        await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(async (a, b) => Promise.resolve(a + b)),
      );
    });
    test("simple multiply number aggregate", async function () {
      const val = await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(async (a, b) =>
        Promise.resolve(a * b),
      );
      assert.strictEqual(val, 3628800);
    });
    test("transform aggregate", async function () {
      const val = await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(
        1,
        async (a, b) => Promise.resolve(a * b),
        async (o) => Promise.resolve(o / 2),
      );
      assert.strictEqual(val, 1814400);
    });
    test("defaultValue 'string' aggregate", async function () {
      const val = await EnumerableAsync.asEnumerableAsync([1, 2, 3]).aggregate("", async (a: unknown, b: unknown) =>
        Promise.resolve(`${(a as number).toString()}${(b as number).toString()}`),
      );
      assert.strictEqual(val, "123");
    });
    test("single element", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([5]).aggregate(async (x, y) => Promise.resolve(x + y)),
        5,
      );
    });
    test("empty source and seed", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([]).aggregate(2, async (x, y) => Promise.resolve(x * y)),
        2,
      );
    });
    test("single element and seed", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([5]).aggregate(2, async (x, y) => Promise.resolve(x * y)),
        10,
      );
    });
    test("two elements and seed", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([5, 6]).aggregate(2, async (x, y) => Promise.resolve(x * y)),
        60,
      );
    });
    test("no elements seed and result selector", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([]).aggregate(
          2,
          async (x, y) => Promise.resolve(x * y),
          async (x) => Promise.resolve(x + 5),
        ),
        7,
      );
    });
    test("single element seed and result selector", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([5]).aggregate(
          2,
          async (x, y) => Promise.resolve(x * y),
          async (x) => Promise.resolve(x + 5),
        ),
        15,
      );
    });
    test("two elements seed and result selector", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync([5, 6]).aggregate(
          2,
          async (x, y) => Promise.resolve(x * y),
          async (x) => Promise.resolve(x + 5),
        ),
        65,
      );
    });
    test("Basic", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync(["f", "o", "o"]).aggregate(async (x, y) => Promise.resolve(x + y)),
        "foo",
      );

      const sentence = "the quick brown fox jumps over the lazy dog";
      // Split the string into individual words.
      const words = EnumerableAsync.asEnumerableAsync(sentence.split(" "));
      // Prepend each word to the beginning of the
      // new sentence to reverse the word order.
      const reversed = await words.aggregate(async (workingSentence, next) =>
        Promise.resolve(next + " " + workingSentence),
      );
      assert.strictEqual(reversed, "dog lazy the over jumps fox brown quick the");
    });
    test("ResultSelector", async function () {
      const fruits = EnumerableAsync.asEnumerableAsync(["apple", "mango", "orange", "passionfruit", "grape"]);

      // Determine whether any string in the array is longer than "banana".
      const longestName = await fruits.aggregate(
        "banana",
        async (longest, next) => Promise.resolve(next.length > longest.length ? next : longest),
        // Return the final result as an upper case string.
        async (fruit) => Promise.resolve(fruit.toUpperCase()),
      );

      assert.strictEqual(longestName, "PASSIONFRUIT");
    });
    test("Exception", async function () {
      assert.rejects(
        EnumerableAsync.asEnumerableAsync<number>([]).aggregate(async (x, y) => Promise.resolve(x + y)),
        Exceptions.ThrowNoElementsException,
      );
    });
  });
});
