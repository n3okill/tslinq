import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("elementAtOrDefault", function () {
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).elementAtOrDefault(10), 0);
      assert.strictEqual(Enumerable.asEnumerable(["a", "b", "c"]).elementAtOrDefault(5), "");
      assert.strictEqual(Enumerable.asEnumerable([1, 2, 3]).elementAtOrDefault(1), 2);
      assert.strictEqual(Enumerable.asEnumerable(["a", "b", "c"]).elementAtOrDefault(2), "c");
      assert.strictEqual(Enumerable.asEnumerable([]).elementAtOrDefault(0), undefined);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.strictEqual(e.elementAtOrDefault(1), e.elementAtOrDefault(1));
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).elementAtOrDefault(10), 0);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync(["a", "b", "c"]).elementAtOrDefault(5), "");
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).elementAtOrDefault(1), 2);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync(["a", "b", "c"]).elementAtOrDefault(2), "c");
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([]).elementAtOrDefault(0), undefined);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.strictEqual(await e.elementAtOrDefault(1), await e.elementAtOrDefault(1));
    });
  });
});
