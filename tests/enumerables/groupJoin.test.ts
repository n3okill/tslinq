import { AsyncEnumerable, Enumerable } from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import { CaseInsensitiveEqualityComparer } from "../shared.ts";

describe("groupJoin", function () {
  class Person {
    public Name: string;
    constructor(Name: string) {
      this.Name = Name;
    }
  }
  class Pet {
    public Name: string;
    public Owner: Person;

    constructor(Name: string, Owner: Person) {
      this.Name = Name;
      this.Owner = Owner;
    }
  }
  const magnus = new Person("Hedlund, Magnus");
  const terry = new Person("Adams, Terry");
  const charlotte = new Person("Weiss, Charlotte");

  const barley = new Pet("Barley", terry);
  const boots = new Pet("Boots", terry);
  const whiskers = new Pet("Whiskers", charlotte);
  const daisy = new Pet("Daisy", magnus);

  const people = [magnus, terry, charlotte];
  const pets = [barley, boots, whiskers, daisy];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.create(people);
      const grouping = e.groupJoin(
        pets,
        (person) => person,
        (pet) => pet.Owner,
        (person, petCollection) => {
          return {
            OwnerName: person.Name,
            Pets: petCollection.select((pet) => pet.Name).toArray(),
          };
        },
      );
      assert.deepStrictEqual(grouping.toArray(), [
        { OwnerName: "Hedlund, Magnus", Pets: ["Daisy"] },
        { OwnerName: "Adams, Terry", Pets: ["Barley", "Boots"] },
        { OwnerName: "Weiss, Charlotte", Pets: ["Whiskers"] },
      ]);
    });
    test("repeated calls", function () {
      const e = Enumerable.create(people);
      const grouping = e.groupJoin(
        Enumerable.create(pets),
        (person) => person,
        (pet) => pet.Owner,
        (person, petCollection) => {
          return {
            OwnerName: person.Name,
            Pets: petCollection.select((pet) => pet.Name).toArray(),
          };
        },
      );
      assert.deepStrictEqual(grouping.toArray(), grouping.toArray());
    });

    test("empty inner sequence", () => {
      const people: Array<Person> = [{ Name: "John" }];
      const pets: Array<Pet> = [];

      const result = Enumerable.create(people).groupJoin(
        pets,
        (person) => person,
        (pet) => pet.Owner,
        (person, petGroup) => ({
          owner: person.Name,
          pets: petGroup.toArray(),
        }),
      );

      assert.deepStrictEqual(result.toArray(), [{ owner: "John", pets: [] }]);
    });

    test("empty outer sequence", () => {
      const people: Array<Person> = [];
      const pets: Array<Pet> = [{ Owner: people[0], Name: "Rex" }];

      const result = Enumerable.create(people)
        .groupJoin(
          pets,
          (person) => person,
          (pet) => pet.Owner,
          (person, petGroup) => ({
            owner: person.Name,
            pets: petGroup.toArray(),
          }),
        )
        .toArray();

      assert.deepStrictEqual(result, []);
    });

    test("with custom comparer", () => {
      const people = ["JOHN", "JANE"];
      const pets = [
        { owner: "john", pet: "Rex" },
        { owner: "john", pet: "Fido" },
        { owner: "jane", pet: "Whiskers" },
      ];
      const result = Enumerable.create(people).groupJoin(
        pets,
        (person) => person,
        (pet) => pet.owner,
        (person, petGroup) => ({
          owner: person,
          pets: petGroup.select((p) => p.pet).toArray(),
        }),
        new CaseInsensitiveEqualityComparer(),
      );

      assert.deepStrictEqual(result.toArray(), [
        { owner: "JOHN", pets: ["Rex", "Fido"] },
        { owner: "JANE", pets: ["Whiskers"] },
      ]);
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create(people);
      const grouping = e.groupJoin(
        pets,
        (person) => person,
        (pet) => pet.Owner,
        async (person, petCollection) => {
          return {
            OwnerName: person.Name,
            Pets: await petCollection.select((pet: Pet) => pet.Name).toArray(),
          };
        },
      );
      //console.log(await grouping.toArray());
      assert.deepStrictEqual(await grouping.toArray(), [
        { OwnerName: "Hedlund, Magnus", Pets: ["Daisy"] },
        { OwnerName: "Adams, Terry", Pets: ["Barley", "Boots"] },
        { OwnerName: "Weiss, Charlotte", Pets: ["Whiskers"] },
      ]);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(people);
      const grouping = e.groupJoin(
        AsyncEnumerable.create(pets),
        (person) => person,
        (pet) => pet.Owner,
        async (person, petCollection) => {
          return {
            OwnerName: person.Name,
            Pets: await petCollection.select((pet: Pet) => pet.Name).toArray(),
          };
        },
      );
      assert.deepStrictEqual(
        await grouping.toArray(),
        await grouping.toArray(),
      );
    });
  });
  describe("AsyncEnumerable async", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create(people);
      const grouping = e.groupJoin(
        AsyncEnumerable.create(pets),
        async (person) => Promise.resolve(person),
        async (pet) => Promise.resolve(pet.Owner),
        async (person, petCollection) =>
          Promise.resolve({
            OwnerName: person.Name,
            Pets: await petCollection.select((pet: Pet) => pet.Name).toArray(),
          }),
      );
      assert.deepStrictEqual(await grouping.toArray(), [
        { OwnerName: "Hedlund, Magnus", Pets: ["Daisy"] },
        { OwnerName: "Adams, Terry", Pets: ["Barley", "Boots"] },
        { OwnerName: "Weiss, Charlotte", Pets: ["Whiskers"] },
      ]);
    });
  });
});
