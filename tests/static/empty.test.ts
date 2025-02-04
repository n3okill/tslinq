import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { AsyncEnumerable, Enumerable } from "../../src/index.ts";

describe("empty", function () {
  const names1: Array<string> = ["Hartono, Tommy"];
  const names2: Array<string> = [
    "Adams, Terry",
    "Andersen, Henriette Thaulow",
    "Hedlund, Magnus",
    "Ito, Shu",
  ];
  const names3: Array<string> = [
    "Solanki, Ajay",
    "Hoeing, Helge",
    "Andersen, Henriette Thaulow",
    "Potra, Cristina",
    "Iallo, Lucio",
  ];
  describe("Enumerable", function () {
    test("basic", function () {
      const nameList = Enumerable.create([names1, names2, names3]);
      const allNames = nameList.aggregate(
        (current, next) => (next.length > 3 ? current.union(next) : current),
        Enumerable.empty(String),
      );
      const result = [
        "Adams, Terry",
        "Andersen, Henriette Thaulow",
        "Hedlund, Magnus",
        "Ito, Shu",
        "Solanki, Ajay",
        "Hoeing, Helge",
        "Potra, Cristina",
        "Iallo, Lucio",
      ];
      assert.deepStrictEqual(allNames.toArray(), result);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const nameList = AsyncEnumerable.create([names1, names2, names3]);
      const allNames = await nameList.aggregate(
        (current, next) => (next.length > 3 ? current.union(next) : current),
        AsyncEnumerable.empty(String),
      );
      const result = [
        "Adams, Terry",
        "Andersen, Henriette Thaulow",
        "Hedlund, Magnus",
        "Ito, Shu",
        "Solanki, Ajay",
        "Hoeing, Helge",
        "Potra, Cristina",
        "Iallo, Lucio",
      ];
      assert.deepStrictEqual(await allNames.toArray(), result);
    });
  });
});
