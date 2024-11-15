import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("empty", function () {
  const names1: Array<string> = ["Hartono, Tommy"];
  const names2: Array<string> = ["Adams, Terry", "Andersen, Henriette Thaulow", "Hedlund, Magnus", "Ito, Shu"];
  const names3: Array<string> = [
    "Solanki, Ajay",
    "Hoeing, Helge",
    "Andersen, Henriette Thaulow",
    "Potra, Cristina",
    "Iallo, Lucio",
  ];
  describe("Enumerable", function () {
    test("basic", function () {
      const nameList = Enumerable.asEnumerable([names1, names2, names3]);
      const allNames = nameList.aggregate<Interfaces.IEnumerable<string>, Enumerable<string>>(
        Enumerable.empty(String),
        (current, next) =>
          next.length > 3 ? (current as unknown as Enumerable<string>).union(next) : (current as Enumerable<string>),
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
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const nameList = EnumerableAsync.asEnumerableAsync([names1, names2, names3]);
      const allNames = await nameList.aggregate<Interfaces.IAsyncEnumerable<string>, EnumerableAsync<string>>(
        EnumerableAsync.empty(String),
        (current, next) =>
          next.length > 3
            ? (current as unknown as EnumerableAsync<string>).union(next)
            : (current as EnumerableAsync<string>),
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
