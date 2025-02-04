import {
  AsyncEnumerable,
  Enumerable,
  InvalidArgumentException,
  NotIterableException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import {
  CaseInsensitiveEqualityComparer,
  WeakEqualityComparer,
  WeakEqualityComparerAsync,
} from "../shared.ts";

describe("join", function () {
  interface Order {
    id: number;
    customerId: number;
    total: number;
  }

  interface Customer {
    id: number;
    name: string;
  }

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
      const result = Enumerable.create([1, 2, 3])
        .join(
          [1, 2, 3],
          (x) => x,
          (x) => x,
          (x, y) => ({ x, y }),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ]);
    });
    test("object", function () {
      const e = Enumerable.create(people);
      const grouping = e.join(
        pets,
        (person) => person,
        (pet) => pet.Owner,
        (person, pet) => {
          return { OwnerName: person.Name, Pet: pet.Name };
        },
      );
      assert.deepStrictEqual(grouping.toArray(), [
        { OwnerName: "Hedlund, Magnus", Pet: "Daisy" },
        { OwnerName: "Adams, Terry", Pet: "Barley" },
        { OwnerName: "Adams, Terry", Pet: "Boots" },
        { OwnerName: "Weiss, Charlotte", Pet: "Whiskers" },
      ]);
    });
    test("comparer", function () {
      const result = Enumerable.create(["1", 2, 3])
        .join(
          [1, "2", 3],
          (x) => x,
          (x) => x,
          (x, y) => ({ x, y }),
          new WeakEqualityComparer(),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: "1", y: 1 },
        { x: 2, y: "2" },
        { x: 3, y: 3 },
      ]);
    });
    test("repeated calls", function () {
      const result = Enumerable.create([1, 2, 3]).join(
        [1, 2, 3],
        (x) => x,
        (x) => x,
        (x, y) => ({ x, y }),
      );
      assert.deepStrictEqual(result.toArray(), result.toArray());
    });
    test("empty outer sequence returns empty", () => {
      const result = Enumerable.create<number>([])
        .join(
          [1, 2, 3],
          (x) => x,
          (y) => y,
          (outer, inner) => ({ outer, inner }),
        )
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("empty inner sequence returns empty", () => {
      const result = Enumerable.create([1, 2, 3])
        .join(
          [],
          (x) => x,
          (y) => y,
          (outer, inner) => ({ outer, inner }),
        )
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("basic number join", () => {
      const outer = [1, 2];
      const inner = [2, 3, 2];

      const result = Enumerable.create(outer)
        .join(
          inner,
          (x) => x,
          (y) => y,
          (o, i) => `${o}-${i}`,
        )
        .toArray();

      assert.deepStrictEqual(result, ["2-2", "2-2"]);
    });

    test("customer orders join", () => {
      const customers: Array<Customer> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];

      const orders: Array<Order> = [
        { id: 1, customerId: 1, total: 100 },
        { id: 2, customerId: 1, total: 200 },
        { id: 3, customerId: 2, total: 300 },
      ];

      const result = Enumerable.create(customers)
        .join(
          orders,
          (c) => c.id,
          (o) => o.customerId,
          (c, o) => ({
            customerName: c.name,
            orderTotal: o.total,
          }),
        )
        .toArray();

      assert.deepStrictEqual(result, [
        { customerName: "John", orderTotal: 100 },
        { customerName: "John", orderTotal: 200 },
        { customerName: "Jane", orderTotal: 300 },
      ]);
    });

    test("case insensitive join", () => {
      const result = Enumerable.create(["A", "B"])
        .join(
          ["a", "b"],
          (x) => x,
          (y) => y,
          (o, i) => `${o}-${i}`,
          new CaseInsensitiveEqualityComparer(),
        )
        .toArray();

      assert.deepStrictEqual(result, ["A-a", "B-b"]);
    });
    test("throws on invalid inner sequence", () => {
      assert.throws(
        () =>
          Enumerable.create([1]).join(
            1 as never,
            (x) => x,
            (y) => y,
            (o) => o,
          ),
        NotIterableException,
      );
    });
    test("throws on invalid outer key selector", () => {
      assert.throws(
        () =>
          Enumerable.create([1]).join(
            [2],
            null as never,
            (y) => y,
            (o) => o,
          ),
        InvalidArgumentException,
      );
    });

    test("throws on invalid inner key selector", () => {
      assert.throws(
        () =>
          Enumerable.create([1]).join(
            [2],
            (x) => x,
            null as never,
            (o) => o,
          ),
        InvalidArgumentException,
      );
    });

    test("throws on invalid result selector", () => {
      assert.throws(
        () =>
          Enumerable.create([1]).join(
            [2],
            (x) => x,
            (y) => y,
            null as never,
          ),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .join(
          [1, 2, 3],
          (x) => x,
          (x) => x,
          (x, y) => ({ x, y }),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ]);
    });
    test("object", async function () {
      const e = AsyncEnumerable.create(people);
      const grouping = e.join(
        pets,
        (person) => person,
        (pet) => pet.Owner,
        (person, pet) => {
          return { OwnerName: person.Name, Pet: pet.Name };
        },
      );
      assert.deepStrictEqual(await grouping.toArray(), [
        { OwnerName: "Hedlund, Magnus", Pet: "Daisy" },
        { OwnerName: "Adams, Terry", Pet: "Barley" },
        { OwnerName: "Adams, Terry", Pet: "Boots" },
        { OwnerName: "Weiss, Charlotte", Pet: "Whiskers" },
      ]);
    });
    test("comparer", async function () {
      const result = await AsyncEnumerable.create(["1", 2, 3])
        .join(
          [1, "2", 3],
          (x) => x,
          (x) => x,
          (x, y) => ({ x, y }),
          new WeakEqualityComparer(),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: "1", y: 1 },
        { x: 2, y: "2" },
        { x: 3, y: 3 },
      ]);
    });
    test("repeated calls", async function () {
      const result = AsyncEnumerable.create([1, 2, 3]).join(
        [1, 2, 3],
        (x) => x,
        (x) => x,
        (x, y) => ({ x, y }),
      );
      assert.deepStrictEqual(await result.toArray(), await result.toArray());
    });
    test("basic async join", async () => {
      const result = await AsyncEnumerable.create([1, 2])
        .join(
          [2, 3],
          async (x) => x,
          async (y) => y,
          async (o, i) => `${o}-${i}`,
        )
        .toArray();

      assert.deepStrictEqual(result, ["2-2"]);
    });

    test("async with promises", async () => {
      const outer = [Promise.resolve(1), Promise.resolve(2)];
      const inner = [Promise.resolve(2), Promise.resolve(3)];

      const result = await AsyncEnumerable.create(outer)
        .join(
          inner,
          async (x) => await x,
          async (y) => await y,
          async (o, i) => `${await o}-${await i}`,
        )
        .toArray();

      assert.deepStrictEqual(result, ["2-2"]);
    });
    test("empty outer sequence returns empty", async () => {
      const result = await AsyncEnumerable.create<number>([])
        .join(
          [1, 2, 3],
          (x) => x,
          (y) => y,
          (outer, inner) => ({ outer, inner }),
        )
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("empty inner sequence returns empty", async () => {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .join(
          [],
          (x) => x,
          (y) => y,
          (outer, inner) => ({ outer, inner }),
        )
        .toArray();
      assert.deepStrictEqual(result, []);
    });

    test("basic number join", async () => {
      const outer = [1, 2];
      const inner = [2, 3, 2];

      const result = await AsyncEnumerable.create(outer)
        .join(
          inner,
          (x) => x,
          (y) => y,
          (o, i) => `${o}-${i}`,
        )
        .toArray();

      assert.deepStrictEqual(result, ["2-2", "2-2"]);
    });

    test("customer orders join", async () => {
      const customers: Array<Customer> = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];

      const orders: Array<Order> = [
        { id: 1, customerId: 1, total: 100 },
        { id: 2, customerId: 1, total: 200 },
        { id: 3, customerId: 2, total: 300 },
      ];

      const result = await AsyncEnumerable.create(customers)
        .join(
          orders,
          (c) => c.id,
          (o) => o.customerId,
          (c, o) => ({
            customerName: c.name,
            orderTotal: o.total,
          }),
        )
        .toArray();

      assert.deepStrictEqual(result, [
        { customerName: "John", orderTotal: 100 },
        { customerName: "John", orderTotal: 200 },
        { customerName: "Jane", orderTotal: 300 },
      ]);
    });

    test("case insensitive join", async () => {
      const result = await AsyncEnumerable.create(["A", "B"])
        .join(
          ["a", "b"],
          (x) => x,
          (y) => y,
          (o, i) => `${o}-${i}`,
          new CaseInsensitiveEqualityComparer(),
        )
        .toArray();

      assert.deepStrictEqual(result, ["A-a", "B-b"]);
    });
    test("throws on invalid inner sequence", () => {
      assert.throws(
        () =>
          AsyncEnumerable.create([1]).join(
            1 as never,
            (x) => x,
            (y) => y,
            (o) => o,
          ),
        NotIterableException,
      );
    });
    test("throws on invalid outer key selector", () => {
      assert.throws(
        () =>
          AsyncEnumerable.create([1]).join(
            [2],
            null as never,
            (y) => y,
            (o) => o,
          ),
        InvalidArgumentException,
      );
    });

    test("throws on invalid inner key selector", () => {
      assert.throws(
        () =>
          AsyncEnumerable.create([1]).join(
            [2],
            (x) => x,
            null as never,
            (o) => o,
          ),
        InvalidArgumentException,
      );
    });

    test("throws on invalid result selector", () => {
      assert.throws(
        () =>
          AsyncEnumerable.create([1]).join(
            [2],
            (x) => x,
            (y) => y,
            null as never,
          ),
        InvalidArgumentException,
      );
    });
  });
  describe("AsyncEnumerable async", function () {
    test("basic", async function () {
      const result = await AsyncEnumerable.create([1, 2, 3])
        .join(
          [1, 2, 3],
          async (x) => Promise.resolve(x),
          async (x) => Promise.resolve(x),
          async (x, y) => Promise.resolve({ x, y }),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: 1, y: 1 },
        { x: 2, y: 2 },
        { x: 3, y: 3 },
      ]);
    });
    test("object", async function () {
      const e = AsyncEnumerable.create(people);
      const grouping = e.join(
        pets,
        async (person) => Promise.resolve(person),
        async (pet) => Promise.resolve(pet.Owner),
        async (person, pet) =>
          Promise.resolve({ OwnerName: person.Name, Pet: pet.Name }),
      );
      assert.deepStrictEqual(await grouping.toArray(), [
        { OwnerName: "Hedlund, Magnus", Pet: "Daisy" },
        { OwnerName: "Adams, Terry", Pet: "Barley" },
        { OwnerName: "Adams, Terry", Pet: "Boots" },
        { OwnerName: "Weiss, Charlotte", Pet: "Whiskers" },
      ]);
    });
    test("comparer", async function () {
      const result = await AsyncEnumerable.create(["1", 2, 3])
        .join(
          [1, "2", 3],
          async (x) => Promise.resolve(x),
          async (x) => Promise.resolve(x),
          async (x, y) => Promise.resolve({ x, y }),
          new WeakEqualityComparerAsync(),
        )
        .toArray();
      assert.strictEqual(result.length, 3);
      assert.deepStrictEqual(result, [
        { x: "1", y: 1 },
        { x: 2, y: "2" },
        { x: 3, y: 3 },
      ]);
    });
  });
});
