import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("selectMany", function () {
  class PetOwner {
    public Name: string;
    public Pets: Array<string>;

    constructor(Name: string, Pets: Array<string>) {
      this.Name = Name;
      this.Pets = Pets;
    }
  }

  const petOwners = [
    new PetOwner("Higa", ["Scruffy", "Sam"]),
    new PetOwner("Ashkenazi", ["Walker", "Sugar"]),
    new PetOwner("Price", ["Scratches", "Diesel"]),
    new PetOwner("Hines", ["Dusty"]),
  ];
  const result = [
    { Owner: "Higa", Pet: "Scruffy" },
    { Owner: "Higa", Pet: "Sam" },
    { Owner: "Ashkenazi", Pet: "Sugar" },
    { Owner: "Price", Pet: "Scratches" },
  ];
  const resultSelectMany = [
    "Scruffy",
    "Sam",
    "Walker",
    "Sugar",
    "Scratches",
    "Diesel",
    "Dusty",
  ];
  const resultSelect = [
    ["Scruffy", "Sam"],
    ["Walker", "Sugar"],
    ["Scratches", "Diesel"],
    ["Dusty"],
  ];

  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.create(petOwners)
        .selectMany(
          (petOwner) => petOwner.Pets,
          (petOwner, petName) => {
            return { Owner: petOwner, Pet: petName };
          },
        )
        .where((ownerAndPet) => ownerAndPet.Pet.startsWith("S"))
        .select((ownerAndPet) => {
          return { Owner: ownerAndPet.Owner.Name, Pet: ownerAndPet.Pet };
        });
      assert.deepStrictEqual(e.toArray(), result);
    });
    test("Select", function () {
      const selectMany = Enumerable.create(petOwners).selectMany(
        (petOwner) => petOwner.Pets,
      );
      const select = Enumerable.create(petOwners).select(
        (petOwner) => petOwner.Pets,
      );
      assert.strictEqual(selectMany.toArray().length, 7);
      assert.strictEqual(select.toArray().length, 4);
      assert.deepStrictEqual(selectMany.toArray(), resultSelectMany);
      assert.deepStrictEqual(select.toArray(), resultSelect);
    });
    test("repeated calls", function () {
      const e = Enumerable.create(petOwners)
        .selectMany(
          (petOwner) => petOwner.Pets,
          (petOwner, petName) => {
            return { Owner: petOwner, Pet: petName };
          },
        )
        .where((ownerAndPet) => ownerAndPet.Pet.startsWith("S"))
        .select((ownerAndPet) => {
          return { Owner: ownerAndPet.Owner.Name, Pet: ownerAndPet.Pet };
        });
      assert.deepStrictEqual(e.toArray(), e.toArray());
      assert.deepStrictEqual(e.toArray(), result);
    });
    test("flattens array of arrays", () => {
      const source = [
        [1, 2],
        [3, 4],
      ];
      const result = Enumerable.create(source)
        .selectMany((x) => x)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3, 4]);
    });

    test("with collection selector", () => {
      const source = [1, 2, 3];
      const result = Enumerable.create(source)
        .selectMany((x) => [x, x * 2])
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 2, 4, 3, 6]);
    });

    test("with result selector", () => {
      const source = ["a", "b"];
      const result = Enumerable.create(source)
        .selectMany(
          () => [1, 2],
          (outer, inner) => `${outer}${inner}`,
        )
        .toArray();
      assert.deepStrictEqual(result, ["a1", "a2", "b1", "b2"]);
    });

    test("empty source returns empty", () => {
      const result = Enumerable.create([])
        .selectMany((x) => [x])
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("with index parameter", () => {
      const result = Enumerable.create(["a", "b"])
        .selectMany((x, i) => [x + i])
        .toArray();
      assert.deepStrictEqual(result, ["a0", "b1"]);
    });

    test("with empty inner sequences", () => {
      const source = [[1], [], [2, 3]];
      const result = Enumerable.create(source)
        .selectMany((x) => x)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("throws with null selector", () => {
      assert.throws(
        () => Enumerable.create([]).selectMany(null as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create(petOwners)
        .selectMany(
          (petOwner) => petOwner.Pets,
          (petOwner, petName) => {
            return { Owner: petOwner, Pet: petName };
          },
        )
        .where((ownerAndPet) => ownerAndPet.Pet.startsWith("S"))
        .select((ownerAndPet) => {
          return { Owner: ownerAndPet.Owner.Name, Pet: ownerAndPet.Pet };
        });
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("Select", async function () {
      const selectMany = AsyncEnumerable.create(petOwners).selectMany(
        (petOwner) => petOwner.Pets,
      );
      const select = AsyncEnumerable.create(petOwners).select(
        (petOwner) => petOwner.Pets,
      );
      assert.strictEqual((await selectMany.toArray()).length, 7);
      assert.strictEqual((await select.toArray()).length, 4);
      assert.deepStrictEqual(await selectMany.toArray(), resultSelectMany);
      assert.deepStrictEqual(await select.toArray(), resultSelect);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(petOwners)
        .selectMany(
          (petOwner) => petOwner.Pets,
          (petOwner, petName) => {
            return { Owner: petOwner, Pet: petName };
          },
        )
        .where((ownerAndPet) => ownerAndPet.Pet.startsWith("S"))
        .select((ownerAndPet) => {
          return { Owner: ownerAndPet.Owner.Name, Pet: ownerAndPet.Pet };
        });
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("flattens array of arrays", async () => {
      const source = [
        [1, 2],
        [3, 4],
      ];
      const result = await AsyncEnumerable.create(source)
        .selectMany((x) => x)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3, 4]);
    });

    test("with collection selector", async () => {
      const source = [1, 2, 3];
      const result = await AsyncEnumerable.create(source)
        .selectMany((x) => [x, x * 2])
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 2, 4, 3, 6]);
    });

    test("with result selector", async () => {
      const source = ["a", "b"];
      const result = await AsyncEnumerable.create(source)
        .selectMany(
          () => [1, 2],
          (outer, inner) => `${outer}${inner}`,
        )
        .toArray();
      assert.deepStrictEqual(result, ["a1", "a2", "b1", "b2"]);
    });

    test("empty source returns empty", async () => {
      const result = await AsyncEnumerable.create([])
        .selectMany((x) => [x])
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("with index parameter", async () => {
      const result = await AsyncEnumerable.create(["a", "b"])
        .selectMany((x, i) => [x + i])
        .toArray();
      assert.deepStrictEqual(result, ["a0", "b1"]);
    });

    test("with empty inner sequences", async () => {
      const source = [[1], [], [2, 3]];
      const result = await AsyncEnumerable.create(source)
        .selectMany((x) => x)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3]);
    });

    test("throws with null selector", () => {
      assert.throws(
        () => AsyncEnumerable.create([]).selectMany(null as never),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable async", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create(petOwners)
        .selectMany(
          async (petOwner) => Promise.resolve(petOwner.Pets),
          async (petOwner, petName) =>
            Promise.resolve({ Owner: petOwner, Pet: petName }),
        )
        .where(async (ownerAndPet) =>
          Promise.resolve(ownerAndPet.Pet.startsWith("S")),
        )
        .select(async (ownerAndPet) =>
          Promise.resolve({
            Owner: ownerAndPet.Owner.Name,
            Pet: ownerAndPet.Pet,
          }),
        );
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("Select", async function () {
      const selectMany = AsyncEnumerable.create(petOwners).selectMany(
        async (petOwner) => Promise.resolve(petOwner.Pets),
      );
      const select = AsyncEnumerable.create(petOwners).select(
        async (petOwner) => Promise.resolve(petOwner.Pets),
      );
      assert.strictEqual((await selectMany.toArray()).length, 7);
      assert.strictEqual((await select.toArray()).length, 4);
      assert.deepStrictEqual(await selectMany.toArray(), resultSelectMany);
      assert.deepStrictEqual(await select.toArray(), resultSelect);
    });
    test("async flattening", async () => {
      const source = [
        [1, 2],
        [3, 4],
      ];
      const result = await AsyncEnumerable.create(source)
        .selectMany(async (x) => x)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3, 4]);
    });

    test("async with result selector", async () => {
      const source = ["a", "b"];
      const result = await AsyncEnumerable.create(source)
        .selectMany(
          async () => [1, 2],
          async (outer, inner) => `${outer}${inner}`,
        )
        .toArray();
      assert.deepStrictEqual(result, ["a1", "a2", "b1", "b2"]);
    });

    test("async with promises", async () => {
      const source = [Promise.resolve([1, 2]), Promise.resolve([3, 4])];
      const result = await AsyncEnumerable.create(source)
        .selectMany(async (x) => await x)
        .toArray();
      assert.deepStrictEqual(result, [1, 2, 3, 4]);
    });
  });
});
