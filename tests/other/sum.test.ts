import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("sum", function () {
  class Package {
    constructor(
      public Company: string,
      public Weight: number,
    ) {}
  }
  const packages = [
    new Package("Coho Vineyard", 25),
    new Package("Lucerne Publishing", 18),
    new Package("Wingtip Toys", 6),
    new Package("Adventure Works", 33),
  ];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.asEnumerable([null, 0, 92, null, 100, 37, 81]).sum(), 310);
      assert.strictEqual(Enumerable.asEnumerable([43, 1, 583, 6]).sum(), 633);
      assert.throws(() => Enumerable.asEnumerable([]).sum());
      assert.strictEqual(Enumerable.asEnumerable(["Hello", " ", "World"]).sum(), "Hello World");
    });
    test("selector", function () {
      assert.strictEqual(
        Enumerable.asEnumerable(packages).sum((pkg) => pkg.Weight),
        82,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable([1, 2, 3]);
      assert.strictEqual(e.sum(), e.sum());
    });
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([null, 0, 92, null, 100, 37, 81]).sum(), 310);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([43, 1, 583, 6]).sum(), 633);
      assert.rejects(EnumerableAsync.asEnumerableAsync([]).sum());
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync(["Hello", " ", "World"]).sum(), "Hello World");
    });
    test("selector", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync(packages).sum((pkg) => pkg.Weight), 82);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
      assert.strictEqual(await e.sum(), await e.sum());
    });
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([null, 0, 92, null, 100, 37, 81]).sum(), 310);
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync([43, 1, 583, 6]).sum(), 633);
      await assert.rejects(EnumerableAsync.asEnumerableAsync([]).sum());
      assert.strictEqual(await EnumerableAsync.asEnumerableAsync(["Hello", " ", "World"]).sum(), "Hello World");
    });
    test("selector", async function () {
      assert.strictEqual(
        await EnumerableAsync.asEnumerableAsync(packages).sum(async (pkg) => Promise.resolve(pkg.Weight)),
        82,
      );
    });
  });
});
