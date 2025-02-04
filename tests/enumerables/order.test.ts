import {
  AsyncEnumerable,
  Comparer,
  Enumerable,
  NoElementsException,
  NoElementsSatisfyCondition,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("order", function () {
  class BadComparer1 extends Comparer<number> {
    compare() {
      return 1;
    }
  }
  class BadComparer2 extends Comparer<number> {
    compare() {
      return -1;
    }
  }
  class StringComparerIgnoreCase extends Comparer<string> {
    compare(x: string, y: string): number {
      const a = x.toLowerCase();
      const b = y.toLowerCase();
      return a > b ? 1 : a === b ? 0 : -1;
    }
  }
  class ExtremeComparer extends Comparer<number> {
    compare(x: number, y: number) {
      if (x == y) return 0;
      if (x < y) return Number.MIN_SAFE_INTEGER;
      return Number.MAX_SAFE_INTEGER;
    }
  }
  describe("Enumerable", function () {
    test("same result repeates calls", () => {
      const q = [1, 6, 0, -1, 3];
      const e = Enumerable.create(q);
      assert.deepStrictEqual(
        e
          .order()
          .thenBy((f) => f * 2)
          .toArray(),
        e
          .order()
          .thenBy((f) => f * 2)
          .toArray(),
      );
    });
    test("empty source", () => {
      const source = [];
      assert.strictEqual(Enumerable.create(source).order().toArray(), source);
    });
    test("ordered count", () => {
      const source = Enumerable.range(0, 20).shuffle();
      assert.strictEqual(source.order().count(), 20);
    });
    test("survive bad comparer always returns negative", () => {
      const source = [1];
      assert.deepStrictEqual(
        Enumerable.create(source).order(new BadComparer2()).toArray(),
        source,
      );
    });
    test("survive bad comparer always returns negative positive", () => {
      const source = [1];
      assert.deepStrictEqual(
        Enumerable.create(source).order(new BadComparer1()).toArray(),
        source,
      );
    });
    test("keySelector returns null", () => {
      const source = [null, null, null];
      assert.deepStrictEqual(
        Enumerable.create(source).order().toArray(),
        source,
      );
    });
    test("elements all same key", () => {
      const source = [9, 9, 9, 9, 9, 9, 9, 9, 9];
      assert.deepStrictEqual(
        Enumerable.create(source).order().toArray(),
        source,
      );
    });
    test("first and last are duplicates custom comparer", () => {
      const source = ["Prakash", "Alpha", "dan", "DAN", "Prakash"];
      const expected = ["Alpha", "dan", "DAN", "Prakash", "Prakash"];
      assert.deepStrictEqual(
        Enumerable.create(source)
          .order(new StringComparerIgnoreCase())
          .toArray(),
        expected,
      );
    });
    test("first and last are duplicates undefined comparer", () => {
      const source = [5, 1, 3, 2, 5];
      const expected = [1, 2, 3, 5, 5];
      assert.deepStrictEqual(
        expected,
        Enumerable.create(source).order().toArray(),
      );
    });
    test("source reverse of result undefined comparer", () => {
      const source = [100, 30, 9, 5, 0, -50, -75, null];
      const expected = [-75, -50, 0, null, 5, 9, 30, 100];
      assert.deepStrictEqual(
        expected,
        Enumerable.create(source).order().toArray(),
      );
    });
    test("order extreme comparer", () => {
      const outOfOrder = [7, 1, 0, 9, 3, 5, 4, 2, 8, 6];
      assert.deepStrictEqual(
        Enumerable.range(0, 10).toArray(),
        Enumerable.create(outOfOrder).order(new ExtremeComparer()).toArray(),
      );
    });
    test("first on ordered", () => {
      assert.strictEqual(0, Enumerable.range(0, 10).shuffle().order().first());
      assert.strictEqual(
        9,
        Enumerable.range(0, 10).shuffle().orderDescending().first(),
      );
    });
    test("first on empty ordered throws", () => {
      assert.throws(
        () => Enumerable.create([]).order().first(),
        NoElementsException,
      );
    });
    test("first with predicate on ordered", () => {
      const ordered = Enumerable.range(0, 10).shuffle().order();
      const orderedDescending = Enumerable.range(0, 10)
        .shuffle()
        .orderDescending();
      let counter = 0;

      assert.strictEqual(
        0,
        ordered.first(() => {
          counter++;
          return true;
        }),
      );
      assert.strictEqual(1, counter);

      counter = 0;
      assert.strictEqual(
        9,
        ordered.first((i) => {
          counter++;
          return i === 9;
        }),
      );
      assert.strictEqual(10, counter);

      counter = 0;
      assert.throws(
        () =>
          ordered.first(() => {
            counter++;
            return false;
          }),
        NoElementsSatisfyCondition,
      );
      assert.strictEqual(10, counter);

      counter = 0;
      assert.strictEqual(
        9,
        orderedDescending.first(() => {
          counter++;
          return true;
        }),
      );
      assert.strictEqual(1, counter);

      counter = 0;
      assert.strictEqual(
        0,
        orderedDescending.first((i) => {
          counter++;
          return i === 0;
        }),
      );
      assert.strictEqual(10, counter);

      counter = 0;
      assert.throws(
        () =>
          orderedDescending.first(() => {
            counter++;
            return false;
          }),
        NoElementsSatisfyCondition,
      );
      assert.strictEqual(10, counter);
    });
    test("firstOrDefault on orderes", () => {
      assert.strictEqual(
        0,
        Enumerable.range(0, 10).shuffle().order().firstOrDefault(0),
      );
      assert.strictEqual(
        9,
        Enumerable.range(0, 10).shuffle().orderDescending().firstOrDefault(0),
      );
      assert.strictEqual(
        0,
        Enumerable.empty<number>().order().firstOrDefault(0),
      );
    });
    test("firstOrDefault with predicate on ordered", () => {
      const order = Enumerable.range(0, 10).shuffle().order();
      const orderDescending = Enumerable.range(0, 10)
        .shuffle()
        .orderDescending();
      let counter = 0;

      counter = 0;
      assert.strictEqual(
        0,
        order.firstOrDefault(0, () => {
          counter++;
          return true;
        }),
      );
      assert.strictEqual(1, counter);

      counter = 0;
      assert.strictEqual(
        9,
        order.firstOrDefault(0, (i) => {
          counter++;
          return i === 9;
        }),
      );
      assert.strictEqual(10, counter);

      counter = 0;
      assert.strictEqual(
        0,
        order.firstOrDefault(0, () => {
          counter++;
          return false;
        }),
      );
      assert.strictEqual(10, counter);

      counter = 0;
      assert.strictEqual(
        9,
        orderDescending.firstOrDefault(0, () => {
          counter++;
          return true;
        }),
      );
      assert.strictEqual(1, counter);

      counter = 0;
      assert.strictEqual(
        0,
        orderDescending.firstOrDefault(0, (i) => {
          counter++;
          return i === 0;
        }),
      );
      assert.strictEqual(10, counter);

      counter = 0;
      assert.strictEqual(
        0,
        orderDescending.firstOrDefault(0, () => {
          counter++;
          return false;
        }),
      );
      assert.strictEqual(10, counter);
    });
    test("last on ordered", () => {
      assert.strictEqual(9, Enumerable.range(0, 10).shuffle().order().last());
      assert.strictEqual(
        0,
        Enumerable.range(0, 10).shuffle().orderDescending().last(),
      );
    });
    test("last on ordered matching cases", () => {
      const ints = [0, 1, 2, 9, 1, 2, 3, 9, 4, 5, 7, 8, 9, 0, 1];
      const e = Enumerable.create(ints).order();
      assert.strictEqual(ints[12], e.last());
      assert.strictEqual(ints[12], e.lastOrDefault(0));
      assert.strictEqual(
        ints[12],
        e.last((o) => o % 2 === 1),
      );
      assert.strictEqual(
        ints[12],
        e.lastOrDefault(0, (o) => o % 2 === 1),
      );
    });
    test("last on empty ordered throws", () => {
      assert.throws(
        () => Enumerable.empty<number>().order().last(),
        NoElementsException,
      );
    });
    test("lastOrDefault on ordered", () => {
      assert.strictEqual(
        9,
        Enumerable.range(0, 10).shuffle().order().lastOrDefault(0),
      );
      assert.strictEqual(
        0,
        Enumerable.range(0, 10).shuffle().orderDescending().lastOrDefault(0),
      );
      assert.strictEqual(
        0,
        Enumerable.empty<number>().order().lastOrDefault(0),
      );
    });
    test("elementAt on ordered", () => {
      assert.strictEqual(
        4,
        Enumerable.range(0, 10).shuffle().order().elementAt(4),
      );
      assert.strictEqual(
        5,
        Enumerable.range(0, 10).shuffle().orderDescending().elementAt(4),
      );
    });
    test("enumerator doesnt continue", () => {
      const enumerator = Enumerable.range(0, 3).shuffle().order();
      const iterator = enumerator[Symbol.iterator]();
      let current = iterator.next();
      while (current.done !== true) {
        current = iterator.next();
      }
      assert.strictEqual(true, current.done);
    });
    test("sorts randomized enumerable correctly", () => {
      const data = [0, 1, 2, 3, 8, 16, 1024, 4096, 1_000_000];
      for (const items of data) {
        const randomized = Enumerable.range(0, items)
          .select(() => Math.floor(Math.random() * 100))
          .toArray();
        assert.deepEqual(
          [...randomized].sort((a, b) => a - b),
          Enumerable.create(randomized).order().toArray(),
        );
      }
    });
    test("take one", () => {
      const data = [
        [1],
        [1, 2],
        [2, 1],
        [1, 2, 3, 4, 5],
        [5, 4, 3, 2, 1],
        [4, 3, 2, 1, 5, 9, 8, 7, 6],
        [2, 4, 6, 8, 10, 5, 3, 7, 1, 9],
      ];
      for (const items of data) {
        let count = 0;
        const source = Enumerable.create(items);
        for (const x of source.order().take(1)) {
          count++;
          assert.strictEqual(source.min(), x);
        }
        assert.strictEqual(count, 1);
      }
    });
    test("Implicit Stable Ordering", () => {
      assert.deepStrictEqual(
        Enumerable.range("a", 10).shuffle().order("string").toArray(),
        Enumerable.range("a", 10).toArray(),
      );
      assert.deepStrictEqual(
        Enumerable.range(0, 15).shuffle().order("number").toArray(),
        Enumerable.range(0, 15).toArray(),
      );
      assert.deepStrictEqual(
        Enumerable.range("a", 10)
          .shuffle()
          .order(Comparer.defaultString)
          .toArray(),
        Enumerable.range("a", 10).toArray(),
      );
      assert.deepStrictEqual(
        Enumerable.range(0, 15).shuffle().order(Comparer.default).toArray(),
        Enumerable.range(0, 15).toArray(),
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("same result repeates calls", async () => {
      const q = [1, 6, 0, -1, 3];
      const e = AsyncEnumerable.create(q);
      assert.deepStrictEqual(
        await e
          .order()
          .thenBy((f) => f * 2)
          .toArray(),
        await e
          .order()
          .thenBy((f) => f * 2)
          .toArray(),
      );
    });
    test("empty source", async () => {
      const source = [];
      //In this case it's not equal because async methods can't use the ImplicitStableChooser
      assert.notEqual(
        await AsyncEnumerable.create(source).order().toArray(),
        source,
      );
    });
    test("ordered count", async () => {
      const source = AsyncEnumerable.range(0, 20).shuffle();
      assert.strictEqual(await source.order().count(), 20);
    });
    test("survive bad comparer always returns negative", async () => {
      const source = [1];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(source)
          .order(new BadComparer2())
          .toArray(),
        source,
      );
    });
    test("survive bad comparer always returns negative positive", async () => {
      const source = [1];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(source)
          .order(new BadComparer1())
          .toArray(),
        source,
      );
    });
    test("keySelector returns null", async () => {
      const source = [null, null, null];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(source).order().toArray(),
        source,
      );
    });
    test("elements all same key", async () => {
      const source = [9, 9, 9, 9, 9, 9, 9, 9, 9];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(source).order().toArray(),
        source,
      );
    });
    test("first and last are duplicates custom comparer", async () => {
      const source = ["Prakash", "Alpha", "dan", "DAN", "Prakash"];
      const expected = ["Alpha", "dan", "DAN", "Prakash", "Prakash"];
      assert.deepStrictEqual(
        await AsyncEnumerable.create(source)
          .order(new StringComparerIgnoreCase())
          .toArray(),
        expected,
      );
    });
    test("first and last are duplicates undefined comparer", async () => {
      const source = [5, 1, 3, 2, 5];
      const expected = [1, 2, 3, 5, 5];
      assert.deepStrictEqual(
        expected,
        await AsyncEnumerable.create(source).order().toArray(),
      );
    });
    test("source reverse of result undefined comparer", async () => {
      const source = [100, 30, 9, 5, 0, -50, -75, null];
      const expected = [-75, -50, 0, null, 5, 9, 30, 100];
      assert.deepStrictEqual(
        expected,
        await AsyncEnumerable.create(source).order().toArray(),
      );
    });
    test("order extreme comparer", async () => {
      const outOfOrder = [7, 1, 0, 9, 3, 5, 4, 2, 8, 6];
      assert.deepStrictEqual(
        await AsyncEnumerable.range(0, 10).toArray(),
        await AsyncEnumerable.create(outOfOrder)
          .order(new ExtremeComparer())
          .toArray(),
      );
    });
    test("first on ordered", async () => {
      assert.strictEqual(
        0,
        await AsyncEnumerable.range(0, 10).shuffle().order().first(),
      );
      assert.strictEqual(
        9,
        await AsyncEnumerable.range(0, 10).shuffle().orderDescending().first(),
      );
    });
    test("first on empty ordered throws", async () => {
      await assert.rejects(
        AsyncEnumerable.create([]).order().first(),
        NoElementsException,
      );
    });
    test("first with predicate on ordered", async () => {
      const ordered = AsyncEnumerable.range(0, 10).shuffle().order();
      const orderedDescending = AsyncEnumerable.range(0, 10)
        .shuffle()
        .orderDescending();
      let counter = 0;

      assert.strictEqual(
        0,
        await ordered.first(() => {
          counter++;
          return true;
        }),
      );
      assert.strictEqual(1, counter);

      counter = 0;
      assert.strictEqual(
        9,
        await ordered.first((i) => {
          counter++;
          return i === 9;
        }),
      );
      assert.strictEqual(10, counter);

      counter = 0;
      await assert.rejects(
        ordered.first(() => {
          counter++;
          return false;
        }),
        NoElementsSatisfyCondition,
      );
      assert.strictEqual(10, counter);

      counter = 0;
      assert.strictEqual(
        9,
        await orderedDescending.first(() => {
          counter++;
          return true;
        }),
      );
      assert.strictEqual(1, counter);

      counter = 0;
      assert.strictEqual(
        0,
        await orderedDescending.first((i) => {
          counter++;
          return i === 0;
        }),
      );
      assert.strictEqual(10, counter);

      counter = 0;
      await assert.rejects(
        orderedDescending.first(() => {
          counter++;
          return false;
        }),
        NoElementsSatisfyCondition,
      );
      assert.strictEqual(10, counter);
    });
    test("firstOrDefault on orderes", async () => {
      assert.strictEqual(
        0,
        await AsyncEnumerable.range(0, 10).shuffle().order().firstOrDefault(0),
      );
      assert.strictEqual(
        9,
        await AsyncEnumerable.range(0, 10)
          .shuffle()
          .orderDescending()
          .firstOrDefault(0),
      );
      assert.strictEqual(
        0,
        await AsyncEnumerable.empty<number>().order().firstOrDefault(0),
      );
    });
    test("firstOrDefault with predicate on ordered", async () => {
      const order = AsyncEnumerable.range(0, 10).shuffle().order();
      const orderDescending = AsyncEnumerable.range(0, 10)
        .shuffle()
        .orderDescending();
      let counter = 0;

      counter = 0;
      assert.strictEqual(
        0,
        await order.firstOrDefault(0, () => {
          counter++;
          return true;
        }),
      );
      assert.strictEqual(1, counter);

      counter = 0;
      assert.strictEqual(
        9,
        await order.firstOrDefault(0, (i) => {
          counter++;
          return i === 9;
        }),
      );
      assert.strictEqual(10, counter);

      counter = 0;
      assert.strictEqual(
        0,
        await order.firstOrDefault(0, () => {
          counter++;
          return false;
        }),
      );
      assert.strictEqual(10, counter);

      counter = 0;
      assert.strictEqual(
        9,
        await orderDescending.firstOrDefault(0, () => {
          counter++;
          return true;
        }),
      );
      assert.strictEqual(1, counter);

      counter = 0;
      assert.strictEqual(
        0,
        await orderDescending.firstOrDefault(0, (i) => {
          counter++;
          return i === 0;
        }),
      );
      assert.strictEqual(10, counter);

      counter = 0;
      assert.strictEqual(
        0,
        await orderDescending.firstOrDefault(0, () => {
          counter++;
          return false;
        }),
      );
      assert.strictEqual(10, counter);
    });
    test("last on ordered", async () => {
      assert.strictEqual(
        9,
        await AsyncEnumerable.range(0, 10).shuffle().order().last(),
      );
      assert.strictEqual(
        0,
        await AsyncEnumerable.range(0, 10).shuffle().orderDescending().last(),
      );
    });
    test("last on ordered matching cases", async () => {
      const ints = [0, 1, 2, 9, 1, 2, 3, 9, 4, 5, 7, 8, 9, 0, 1];
      const e = AsyncEnumerable.create(ints).order();
      assert.strictEqual(ints[12], await e.last());
      assert.strictEqual(ints[12], await e.lastOrDefault(0));
      assert.strictEqual(ints[12], await e.last((o) => o % 2 === 1));
      assert.strictEqual(
        ints[12],
        await e.lastOrDefault(0, (o) => o % 2 === 1),
      );
    });
    test("last on empty ordered throws", async () => {
      await assert.rejects(
        AsyncEnumerable.empty<number>().order().last(),
        NoElementsException,
      );
    });
    test("lastOrDefault on ordered", async () => {
      assert.strictEqual(
        9,
        await AsyncEnumerable.range(0, 10).shuffle().order().lastOrDefault(0),
      );
      assert.strictEqual(
        0,
        await AsyncEnumerable.range(0, 10)
          .shuffle()
          .orderDescending()
          .lastOrDefault(0),
      );
      assert.strictEqual(
        0,
        await AsyncEnumerable.empty<number>().order().lastOrDefault(0),
      );
    });
    test("elementAt on ordered", async () => {
      assert.strictEqual(
        4,
        await AsyncEnumerable.range(0, 10).shuffle().order().elementAt(4),
      );
      assert.strictEqual(
        5,
        await AsyncEnumerable.range(0, 10)
          .shuffle()
          .orderDescending()
          .elementAt(4),
      );
    });
    test("enumerator doesnt continue", async () => {
      const enumerator = AsyncEnumerable.range(0, 3).shuffle().order();
      const iterator = enumerator[Symbol.asyncIterator]();
      let current = await iterator.next();
      while (current.done !== true) {
        current = await iterator.next();
      }
      assert.strictEqual(true, current.done);
    });
    test("sorts randomized enumerable correctly", async () => {
      const data = [0, 1, 2, 3, 8, 16, 1024, 4096];
      for (const items of data) {
        const randomized = await AsyncEnumerable.range(0, items)
          .select(() => Math.floor(Math.random() * 100))
          .toArray();
        assert.deepEqual(
          [...randomized].sort((a, b) => a - b),
          await AsyncEnumerable.create(randomized).order().toArray(),
        );
      }
    });
    test("take one", async () => {
      const data = [
        [1],
        [1, 2],
        [2, 1],
        [1, 2, 3, 4, 5],
        [5, 4, 3, 2, 1],
        [4, 3, 2, 1, 5, 9, 8, 7, 6],
        [2, 4, 6, 8, 10, 5, 3, 7, 1, 9],
      ];
      for (const items of data) {
        let count = 0;
        const source = AsyncEnumerable.create(items);
        for await (const x of source.order().take(1)) {
          count++;
          assert.strictEqual(await source.min(), x);
        }
        assert.strictEqual(count, 1);
      }
    });
    test("Implicit Stable Ordering", async () => {
      assert.deepStrictEqual(
        await AsyncEnumerable.range("a", 10)
          .shuffle()
          .order("string")
          .toArray(),
        await AsyncEnumerable.range("a", 10).toArray(),
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.range(0, 15).shuffle().order("number").toArray(),
        await AsyncEnumerable.range(0, 15).toArray(),
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.range("a", 10)
          .shuffle()
          .order(Comparer.defaultString)
          .toArray(),
        await AsyncEnumerable.range("a", 10).toArray(),
      );
      assert.deepStrictEqual(
        await AsyncEnumerable.range(0, 15)
          .shuffle()
          .order(Comparer.default)
          .toArray(),
        await AsyncEnumerable.range(0, 15).toArray(),
      );
    });
  });
});
