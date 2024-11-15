import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("selectMany", function () {
  class PetOwner {
    constructor(
      public Name: string,
      public Pets: Array<string>,
    ) {}
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
  const resultSelectMany = ["Scruffy", "Sam", "Walker", "Sugar", "Scratches", "Diesel", "Dusty"];
  const resultSelect = [["Scruffy", "Sam"], ["Walker", "Sugar"], ["Scratches", "Diesel"], ["Dusty"]];

  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.asEnumerable(petOwners)
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
      const selectMany = Enumerable.asEnumerable(petOwners).selectMany((petOwner) => petOwner.Pets);
      const select = Enumerable.asEnumerable(petOwners).select((petOwner) => petOwner.Pets);
      assert.strictEqual(selectMany.toArray().length, 7);
      assert.strictEqual(select.toArray().length, 4);
      assert.deepStrictEqual(selectMany.toArray(), resultSelectMany);
      assert.deepStrictEqual(select.toArray(), resultSelect);
    });
    test("repeated calls", function () {
      const e = Enumerable.asEnumerable(petOwners)
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
  });
  describe("EnumerableAsync", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(petOwners)
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
      const selectMany = EnumerableAsync.asEnumerableAsync(petOwners).selectMany((petOwner) => petOwner.Pets);
      const select = EnumerableAsync.asEnumerableAsync(petOwners).select((petOwner) => petOwner.Pets);
      assert.strictEqual((await selectMany.toArray()).length, 7);
      assert.strictEqual((await select.toArray()).length, 4);
      assert.deepStrictEqual(await selectMany.toArray(), resultSelectMany);
      assert.deepStrictEqual(await select.toArray(), resultSelect);
    });
    test("repeated calls", async function () {
      const e = EnumerableAsync.asEnumerableAsync(petOwners)
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
  });
  describe("EnumerableAsync async", function () {
    test("basic", async function () {
      const e = EnumerableAsync.asEnumerableAsync(petOwners)
        .selectMany(
          async (petOwner) => Promise.resolve(petOwner.Pets),
          async (petOwner, petName) => Promise.resolve({ Owner: petOwner, Pet: petName }),
        )
        .where(async (ownerAndPet) => Promise.resolve(ownerAndPet.Pet.startsWith("S")))
        .select(async (ownerAndPet) =>
          Promise.resolve({
            Owner: ownerAndPet.Owner.Name,
            Pet: ownerAndPet.Pet,
          }),
        );
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("Select", async function () {
      const selectMany = EnumerableAsync.asEnumerableAsync(petOwners).selectMany(async (petOwner) =>
        Promise.resolve(petOwner.Pets),
      );
      const select = EnumerableAsync.asEnumerableAsync(petOwners).select(async (petOwner) =>
        Promise.resolve(petOwner.Pets),
      );
      assert.strictEqual((await selectMany.toArray()).length, 7);
      assert.strictEqual((await select.toArray()).length, 4);
      assert.deepStrictEqual(await selectMany.toArray(), resultSelectMany);
      assert.deepStrictEqual(await select.toArray(), resultSelect);
    });
  });
});
