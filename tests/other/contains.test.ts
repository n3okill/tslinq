import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("Contains", function () {
  class Comparer extends Interfaces.IEqualityComparer<number> {
    Equals(x?: number, y?: number): boolean {
      return (x as number) + 1 == y;
    }
  }
  describe("Enumerable", function () {
    test("true", function () {
      const c = Enumerable.asEnumerable([-1, 0, 2]);
      assert.ok(c.contains(-1));
      assert.strictEqual(c.contains(-1), c.contains(-1));
      assert.ok(c.contains(3, new Comparer()));
    });
    test("false", function () {
      const c = Enumerable.asEnumerable([-1, 0, 2]);
      assert.ok(!c.contains(3));
      assert.ok(!c.contains(4, new Comparer()));
      assert.ok(!c.contains("2" as unknown as number));
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([-1, 0, 2]);
      assert.strictEqual(e.contains(-1), e.contains(-1));
    });
  });
  describe("EnumerableAsync", function () {
    test("true", async function () {
      const c = EnumerableAsync.asEnumerableAsync([-1, 0, 2]);
      assert.ok(await c.contains(-1));
      assert.strictEqual(await c.contains(-1), await c.contains(-1));
      assert.ok(await c.contains(3, new Comparer()));
    });
    test("false", async function () {
      const c = EnumerableAsync.asEnumerableAsync([-1, 0, 2]);
      assert.ok(!(await c.contains(3)));
      assert.ok(!(await c.contains(4, new Comparer())));
      assert.ok(!(await c.contains("2" as unknown as number)));
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([-1, 0, 2]);
      assert.strictEqual(await e.contains(-1), await e.contains(-1));
    });
  });
  describe("EnumerableAsync async comparer", function () {
    class ComparerAsync extends Interfaces.IAsyncEqualityComparer<number> {
      async Equals(x?: number, y?: number): Promise<boolean> {
        return Promise.resolve((x as number) + 1 == y);
      }
    }
    test("true", async function () {
      const c = EnumerableAsync.asEnumerableAsync([-1, 0, 2]);
      assert.ok(await c.contains(-1));
      assert.strictEqual(await c.contains(-1), await c.contains(-1));
      assert.ok(await c.contains(3, new ComparerAsync()));
    });
    test("false", async function () {
      const c = EnumerableAsync.asEnumerableAsync([-1, 0, 2]);
      assert.ok(!(await c.contains(3)));
      assert.ok(!(await c.contains(4, new ComparerAsync())));
      assert.ok(!(await c.contains("2" as unknown as number)));
    });
  });
});
