import {
  AsyncEnumerable,
  Comparer,
  Enumerable,
  InvalidArgumentException,
} from "../../src/index.ts";
import { describe, test } from "node:test";
import * as assert from "node:assert/strict";

describe("thenBy", function () {
  interface Person {
    lastName: string;
    firstName: string;
    age: number;
  }
  const fruits = [
    "grape",
    "passionfruit",
    "banana",
    "mango",
    "orange",
    "raspberry",
    "apple",
    "blueberry",
  ];
  const result = [
    "apple",
    "grape",
    "mango",
    "banana",
    "orange",
    "blueberry",
    "raspberry",
    "passionfruit",
  ];
  describe("Enumerable", function () {
    test("basic", function () {
      const e = Enumerable.create(fruits)
        .orderBy((fruit) => fruit.length)
        .thenBy((fruit) => fruit);
      assert.deepStrictEqual(e.toArray(), result);
    });
    test("repeated calls", function () {
      const e = Enumerable.create(fruits)
        .orderBy((fruit) => fruit.length)
        .thenBy((fruit) => fruit);
      assert.deepStrictEqual(e.toArray(), e.toArray());
    });
    describe("basic ordering", () => {
      test("empty sequence returns empty", () => {
        const result = Enumerable.create<Person>([])
          .orderBy((x) => x.lastName)
          .thenBy((x) => x.firstName)
          .toArray();
        assert.deepStrictEqual(result, []);
      });

      test("single property sorting remains stable", () => {
        const data = [
          { lastName: "Smith", firstName: "John", age: 30 },
          { lastName: "Smith", firstName: "Jane", age: 25 },
        ];

        const result = Enumerable.create(data)
          .orderBy((x) => x.lastName)
          .thenBy((x) => x.firstName)
          .toArray();

        assert.deepStrictEqual(result, [
          { lastName: "Smith", firstName: "Jane", age: 25 },
          { lastName: "Smith", firstName: "John", age: 30 },
        ]);
      });

      test("multiple thenBy chains", () => {
        const data = [
          { lastName: "Smith", firstName: "John", age: 30 },
          { lastName: "Smith", firstName: "Jane", age: 25 },
          { lastName: "Smith", firstName: "Jane", age: 35 },
        ];

        const result = Enumerable.create(data)
          .orderBy((x) => x.lastName)
          .thenBy((x) => x.firstName)
          .thenBy((x) => x.age)
          .toArray();

        assert.deepStrictEqual(result, [
          { lastName: "Smith", firstName: "Jane", age: 25 },
          { lastName: "Smith", firstName: "Jane", age: 35 },
          { lastName: "Smith", firstName: "John", age: 30 },
        ]);
      });

      test("mix of orderBy and thenByDescending", () => {
        const data = [
          { lastName: "Smith", firstName: "John", age: 30 },
          { lastName: "Smith", firstName: "Jane", age: 25 },
          { lastName: "Doe", firstName: "Jane", age: 35 },
        ];

        const result = Enumerable.create(data)
          .orderBy((x) => x.lastName)
          .thenByDescending((x) => x.age)
          .toArray();

        assert.deepStrictEqual(result, [
          { lastName: "Doe", firstName: "Jane", age: 35 },
          { lastName: "Smith", firstName: "John", age: 30 },
          { lastName: "Smith", firstName: "Jane", age: 25 },
        ]);
      });
    });

    describe("with custom comparers", () => {
      test("case insensitive string comparison", () => {
        class CaseInsensitiveComparer extends Comparer<string> {
          compare(x?: string, y?: string): number {
            return (x || "")
              .toLowerCase()
              .localeCompare((y || "").toLowerCase());
          }
        }

        const data = [
          { lastName: "smith", firstName: "John" },
          { lastName: "SMITH", firstName: "Jane" },
        ];

        const result = Enumerable.create(data)
          .orderBy((x) => x.lastName)
          .thenBy((x) => x.firstName, new CaseInsensitiveComparer())
          .toArray();

        assert.deepStrictEqual(result, [
          { lastName: "SMITH", firstName: "Jane" },
          { lastName: "smith", firstName: "John" },
        ]);
      });
    });

    describe("validation", () => {
      test("throws on null keySelector", () => {
        const data = [{ id: 1 }];
        assert.throws(
          () =>
            Enumerable.create(data)
              .orderBy((x) => x.id)
              .thenBy(null as never),
          InvalidArgumentException,
        );
      });
    });
  });
  describe("AsyncEnumerable", function () {
    test("basic", async function () {
      const e = AsyncEnumerable.create(fruits)
        .orderBy((fruit) => fruit.length)
        .thenBy((fruit) => fruit);
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(fruits)
        .orderBy((fruit) => fruit.length)
        .thenBy((fruit) => fruit);
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    describe("basic ordering", () => {
      test("empty sequence returns empty", async () => {
        const result = await AsyncEnumerable.create<Person>([])
          .orderBy((x) => x.lastName)
          .thenBy((x) => x.firstName)
          .toArray();
        assert.deepStrictEqual(result, []);
      });

      test("single property sorting remains stable", async () => {
        const data = [
          { lastName: "Smith", firstName: "John", age: 30 },
          { lastName: "Smith", firstName: "Jane", age: 25 },
        ];

        const result = await AsyncEnumerable.create(data)
          .orderBy((x) => x.lastName)
          .thenBy((x) => x.firstName)
          .toArray();

        assert.deepStrictEqual(result, [
          { lastName: "Smith", firstName: "Jane", age: 25 },
          { lastName: "Smith", firstName: "John", age: 30 },
        ]);
      });

      test("multiple thenBy chains", async () => {
        const data = [
          { lastName: "Smith", firstName: "John", age: 30 },
          { lastName: "Smith", firstName: "Jane", age: 25 },
          { lastName: "Smith", firstName: "Jane", age: 35 },
        ];

        const result = await AsyncEnumerable.create(data)
          .orderBy((x) => x.lastName)
          .thenBy((x) => x.firstName)
          .thenBy((x) => x.age)
          .toArray();

        assert.deepStrictEqual(result, [
          { lastName: "Smith", firstName: "Jane", age: 25 },
          { lastName: "Smith", firstName: "Jane", age: 35 },
          { lastName: "Smith", firstName: "John", age: 30 },
        ]);
      });

      test("mix of orderBy and thenByDescending", async () => {
        const data = [
          { lastName: "Smith", firstName: "John", age: 30 },
          { lastName: "Smith", firstName: "Jane", age: 25 },
          { lastName: "Doe", firstName: "Jane", age: 35 },
        ];

        const result = await AsyncEnumerable.create(data)
          .orderBy((x) => x.lastName)
          .thenByDescending((x) => x.age)
          .toArray();

        assert.deepStrictEqual(result, [
          { lastName: "Doe", firstName: "Jane", age: 35 },
          { lastName: "Smith", firstName: "John", age: 30 },
          { lastName: "Smith", firstName: "Jane", age: 25 },
        ]);
      });
    });

    describe("with custom comparers", () => {
      test("case insensitive string comparison", async () => {
        class CaseInsensitiveComparer extends Comparer<string> {
          compare(x?: string, y?: string): number {
            return (x || "")
              .toLowerCase()
              .localeCompare((y || "").toLowerCase());
          }
        }

        const data = [
          { lastName: "smith", firstName: "John" },
          { lastName: "SMITH", firstName: "Jane" },
        ];

        const result = await AsyncEnumerable.create(data)
          .orderBy((x) => x.lastName)
          .thenBy((x) => x.firstName, new CaseInsensitiveComparer())
          .toArray();

        assert.deepStrictEqual(result, [
          { lastName: "SMITH", firstName: "Jane" },
          { lastName: "smith", firstName: "John" },
        ]);
      });
    });

    describe("validation", () => {
      test("throws on null keySelector", async () => {
        const data = [{ id: 1 }];
        await assert.rejects(async () => {
          await AsyncEnumerable.create(data)
            .orderBy((x) => x.id)
            .thenBy(null as never)
            .toArray();
        }, InvalidArgumentException);
      });
    });
  });
  describe("AsyncEnumerable async", function () {
    interface AsyncPerson {
      id: number;
      name: string;
      getAge(): Promise<number>;
      getScore(): Promise<number>;
    }
    test("basic", async function () {
      const e = AsyncEnumerable.create(fruits)
        .orderBy(async (fruit) => Promise.resolve(fruit.length))
        .thenBy(async (fruit) => Promise.resolve(fruit));
      assert.deepStrictEqual(await e.toArray(), result);
    });
    test("repeated calls", async function () {
      const e = AsyncEnumerable.create(fruits)
        .orderBy(async (fruit) => Promise.resolve(fruit.length))
        .thenBy(async (fruit) => Promise.resolve(fruit));
      assert.deepStrictEqual(await e.toArray(), await e.toArray());
    });
    test("basic async key selection", async () => {
      const data: Array<AsyncPerson> = [
        {
          id: 1,
          name: "John",
          getAge: async () => 30,
          getScore: async () => 85,
        },
        {
          id: 2,
          name: "John",
          getAge: async () => 25,
          getScore: async () => 90,
        },
      ];

      const result = await AsyncEnumerable.create(data)
        .orderBy((x) => x.name)
        .thenBy(async (x) => await x.getAge())
        .toArray();

      assert.deepStrictEqual(result, [data[1], data[0]]);
    });

    test("multiple async key selectors", async () => {
      const data: Array<AsyncPerson> = [
        {
          id: 1,
          name: "John",
          getAge: async () => 30,
          getScore: async () => 85,
        },
        {
          id: 2,
          name: "John",
          getAge: async () => 30,
          getScore: async () => 90,
        },
      ];

      const result = await AsyncEnumerable.create(data)
        .orderBy((x) => x.name)
        .thenBy(async (x) => await x.getAge())
        .thenBy(async (x) => await x.getScore())
        .toArray();

      assert.deepStrictEqual(result, [data[0], data[1]]);
    });

    test("mix of sync and async selectors", async () => {
      const data: Array<AsyncPerson> = [
        {
          id: 1,
          name: "John",
          getAge: async () => 30,
          getScore: async () => 85,
        },
        {
          id: 2,
          name: "Jane",
          getAge: async () => 30,
          getScore: async () => 90,
        },
      ];

      const result = await AsyncEnumerable.create(data)
        .orderBy(async (x) => await x.getAge())
        .thenBy((x) => x.name)
        .toArray();

      assert.deepStrictEqual(result, [data[1], data[0]]);
    });

    test("handles async errors", async () => {
      const data: Array<AsyncPerson> = [
        {
          id: 1,
          name: "John",
          getAge: async () => {
            throw new Error("Age error");
          },
          getScore: async () => 85,
        },
      ];

      await assert.rejects(async () => {
        await AsyncEnumerable.create(data)
          .orderBy((x) => x.name)
          .thenBy(async (x) => await x.getAge())
          .toArray();
      }, /Age error/);
    });
  });
});
