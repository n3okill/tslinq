import {
  AsyncEnumerable,
  Enumerable,
  InvalidElementsCollection,
  NoElementsException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("sum", function () {
  class Package {
    public Company: string;
    public Weight: number;

    constructor(Company: string, Weight: number) {
      this.Company = Company;
      this.Weight = Weight;
    }
  }
  const packages = [
    new Package("Coho Vineyard", 25),
    new Package("Lucerne Publishing", 18),
    new Package("Wingtip Toys", 6),
    new Package("Adventure Works", 33),
  ];
  describe("Enumerable", function () {
    test("basic", function () {
      assert.strictEqual(Enumerable.create([0, 92, 100, 37, 81]).sum(), 310);
      assert.strictEqual(Enumerable.create([43, 1, 583, 6]).sum(), 633);
      assert.throws(() => Enumerable.create([]).sum(), NoElementsException);
      assert.strictEqual(
        Enumerable.create(["Hello", " ", "World"]).sum(),
        "Hello World",
      );
      assert.strictEqual(Enumerable.create([42]).sum(), 42);
    });
    test("selector", function () {
      assert.strictEqual(
        Enumerable.create(packages).sum((pkg) => pkg.Weight),
        82,
      );
    });
    test("repeated calls", function () {
      const e = Enumerable.create([1, 2, 3]);
      assert.strictEqual(e.sum(), e.sum());
    });
    test("overflow handling", () => {
      const maxValue = Number.MAX_SAFE_INTEGER;
      assert.strictEqual(
        Enumerable.create([maxValue, maxValue]).sum(),
        maxValue * 2,
      );
    });
    test("negative numbers", () => {
      assert.strictEqual(Enumerable.create([-1, -2, -3]).sum(), -6);
    });
    test("should throw for invalid types", () => {
      assert.throws(
        () => Enumerable.create([{}]).sum(),
        InvalidElementsCollection,
      );
    });

    test("should throw for mixed types", () => {
      assert.throws(
        () => Enumerable.create([1, "2"]).sum(),
        InvalidElementsCollection,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create([0, 92, 100, 37, 81]).sum(),
        310,
      );
      assert.strictEqual(
        await AsyncEnumerable.create([43, 1, 583, 6]).sum(),
        633,
      );
      await assert.rejects(
        AsyncEnumerable.create([]).sum() as never,
        NoElementsException,
      );
      assert.strictEqual(
        await AsyncEnumerable.create(["Hello", " ", "World"]).sum(),
        "Hello World",
      );
      assert.strictEqual(await AsyncEnumerable.create([42]).sum(), 42);
    });
    test("selector", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create(packages).sum((pkg) => pkg.Weight),
        82,
      );
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create([1, 2, 3]);
      assert.strictEqual(await e.sum(), await e.sum());
    });
    test("overflow handling", async () => {
      const maxValue = Number.MAX_SAFE_INTEGER;
      assert.strictEqual(
        await AsyncEnumerable.create([maxValue, maxValue]).sum(),
        maxValue * 2,
      );
    });
    test("negative numbers", async () => {
      assert.strictEqual(await AsyncEnumerable.create([-1, -2, -3]).sum(), -6);
    });
    test("should throw for invalid types", async () => {
      await assert.rejects(
        async () => AsyncEnumerable.create([{}]).sum(),
        InvalidElementsCollection,
      );
    });

    test("should throw for mixed types", async () => {
      await assert.rejects(
        async () => AsyncEnumerable.create([1, "2"]).sum(),
        InvalidElementsCollection,
      );
    });
  });
  describe("AsyncEnumerable async", function () {
    test("selector", async function () {
      assert.strictEqual(
        await AsyncEnumerable.create(packages).sum(async (pkg) =>
          Promise.resolve(pkg.Weight),
        ),
        82,
      );
    });
  });
});
