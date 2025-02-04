import { describe, test } from "node:test";
import * as assert from "node:assert/strict";
import {
  Comparer,
  Enumerable,
  EqualityComparer,
  InvalidElementsCollection,
  MoreThanOneElementSatisfiesCondition,
  NoElementsException,
  NoElementsSatisfyCondition,
  OutOfRangeException,
} from "../src/index.ts";

describe("Code Examples", () => {
  describe("enumerable", () => {
    test("aggregate", () => {
      // Sum all numbers
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).aggregate((acc, val) => acc + val),
        6,
      );
      // Find maximum value
      assert.strictEqual(
        Enumerable.create([1, 5, 3]).aggregate((acc, val) =>
          Math.max(acc, val),
        ),
        5,
      );
      // Concatenate strings
      assert.strictEqual(
        Enumerable.create(["a", "b", "c"]).aggregate((acc, val) => acc + val),
        "abc",
      );
      // Sum with initial value
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).aggregate((acc, val) => acc + val, 10),
        16,
      );
      // Custom accumulation with seed
      assert.strictEqual(
        Enumerable.create(["a", "b"]).aggregate(
          (acc, val) => acc + "," + val,
          "start",
        ),
        "start,a,b",
      );
      // Empty sequence with seed returns seed
      assert.strictEqual(
        Enumerable.create([]).aggregate((acc, val) => acc + val, 0),
        0,
      );
      // Sum and convert to string
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).aggregate(
          (acc, val) => acc + val,
          0,
          (sum) => `Total: ${sum}`,
        ),
        "Total: 6",
      );
      // Calculate average
      assert.strictEqual(
        Enumerable.create([1, 2, 3, 4]).aggregate(
          (acc, val) => ({ sum: acc.sum + val, count: acc.count + 1 }),
          { sum: 0, count: 0 },
          (result) => result.sum / result.count,
        ),
        2.5,
      );
    });
    test("aggregateBy", () => {
      // Sum values by category
      const items = [
        { category: "A", value: 10 },
        { category: "B", value: 20 },
        { category: "A", value: 30 },
      ];

      assert.deepStrictEqual(
        Enumerable.create(items)
          .aggregateBy(
            (x) => x.category,
            0,
            (acc, item) => acc + item.value,
          )
          .toArray(),
        [
          ["A", 40],
          ["B", 20],
        ],
      );
      // Using seed selector
      assert.deepStrictEqual(
        Enumerable.create(items)
          .aggregateBy(
            (x) => x.category,
            (key) => ({ key, sum: 0 }),
            (acc, item) => ({ ...acc, sum: acc.sum + item.value }),
          )
          .toArray(),
        [
          [
            "A",
            {
              key: "A",
              sum: 40,
            },
          ],
          [
            "B",
            {
              key: "B",
              sum: 20,
            },
          ],
        ],
      );
    });
    test("all", () => {
      // Check if all numbers are positive
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).all((x) => x > 0),
        true,
      );
      // Check if all numbers are even
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).all((x) => x % 2 === 0),
        false,
      );
      // Empty sequence returns true
      assert.strictEqual(
        Enumerable.create([]).all(() => true),
        true,
      );
    });
    test("any", () => {
      // Check if sequence has any elements
      assert.strictEqual(Enumerable.create([1, 2, 3]).any(), true);
      assert.strictEqual(Enumerable.create([]).any(), false);
      // Check if any element satisfies condition
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).any((x) => x > 2),
        true,
      );
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).any((x) => x > 5),
        false,
      );
      // Empty sequence with predicate returns false
      assert.strictEqual(
        Enumerable.create([]).any(() => true),
        false,
      );
    });
    test("append", () => {
      // Append number
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).append(3).toArray(),
        [1, 2, 3],
      );
      // Append to empty sequence
      assert.deepStrictEqual(
        Enumerable.create<number>([]).append(1).toArray(),
        [1],
      );
      // Append object
      assert.deepStrictEqual(
        Enumerable.create([{ id: 1 }])
          .append({ id: 2 })
          .toArray(),
        [{ id: 1 }, { id: 2 }],
      );
    });
    test("average", () => {
      // Direct numeric average
      assert.strictEqual(Enumerable.create([1, 2, 3]).average(), 2);
      // Average with selector
      assert.strictEqual(
        Enumerable.create([{ value: 10 }, { value: 20 }]).average(
          (x) => x.value,
        ),
        15,
      );
      // Empty sequence throws
      assert.throws(() => Enumerable.create([]).average(), NoElementsException);
    });
    test("chunk", async () => {
      // Basic chunking with remainder
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3, 4, 5]).chunk(2).toArray(),
        [[1, 2], [3, 4], [5]],
      );

      // Empty sequence
      assert.deepStrictEqual(Enumerable.create([]).chunk(2).toArray(), []);

      // Perfect chunks
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3, 4]).chunk(2).toArray(),
        [
          [1, 2],
          [3, 4],
        ],
      );
    });
    test("concat", async () => {
      // Basic number concatenation
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).concat([3, 4]).toArray(),
        [1, 2, 3, 4],
      );

      // String concatenation
      assert.deepStrictEqual(Enumerable.create(["a"]).concat(["b"]).toArray(), [
        "a",
        "b",
      ]);

      // Empty sequence handling - empty second sequence
      assert.deepStrictEqual(Enumerable.create([1]).concat([]).toArray(), [1]);

      // Empty sequence handling - empty first sequence
      assert.deepStrictEqual(
        Enumerable.create<number>([]).concat([1]).toArray(),
        [1],
      );
    });
    test("count", async () => {
      // Total count
      assert.strictEqual(Enumerable.create([1, 2, 3]).count(), 3);

      // Count with predicate
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).count((x) => x > 1),
        2,
      );

      // Empty sequence
      assert.strictEqual(Enumerable.create([]).count(), 0);

      // No matches
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).count((x) => x > 10),
        0,
      );
    });
    test("countBy", async () => {
      // Basic counting by value
      assert.deepStrictEqual(
        Enumerable.create(["a", "b", "a", "c"]).countBy().toArray(),
        [
          ["a", 2],
          ["b", 1],
          ["c", 1],
        ],
      );

      // Counting by object property
      const items = [
        { category: "A", value: 1 },
        { category: "B", value: 2 },
        { category: "A", value: 3 },
      ];
      assert.deepStrictEqual(
        Enumerable.create(items)
          .countBy((x) => x.category)
          .toArray(),
        [
          ["A", 2],
          ["B", 1],
        ],
      );

      // Case insensitive comparison
      class CaseInsensitiveComparer extends EqualityComparer<string> {
        equals(x?: string, y?: string): boolean {
          return (x || "").toLowerCase() === (y || "").toLowerCase();
        }
      }

      const caseResult = Enumerable.create(["A", "a", "B"])
        .countBy((x) => x, new CaseInsensitiveComparer())
        .toArray();
      assert.deepStrictEqual(caseResult, [
        ["A", 2],
        ["B", 1],
      ]);
    });
    test("defaultIfEmpty", async () => {
      // Empty sequence with default
      assert.deepStrictEqual(
        Enumerable.create<number>([]).defaultIfEmpty(0).toArray(),
        [0],
      );

      // Empty sequence without default
      assert.deepStrictEqual(Enumerable.create([]).defaultIfEmpty().toArray(), [
        undefined,
      ]);

      // Non-empty sequence ignores default
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).defaultIfEmpty(0).toArray(),
        [1, 2],
      );

      // Object sequence with default
      assert.deepStrictEqual(
        Enumerable.create<{ id: number }>([])
          .defaultIfEmpty({ id: 0 })
          .toArray(),
        [{ id: 0 }],
      );

      // Mixed types
      assert.deepStrictEqual(
        Enumerable.create<number | string>([])
          .defaultIfEmpty("default")
          .toArray(),
        ["default"],
      );
    });
    test("distinct", async () => {
      // Basic distinct numbers
      assert.deepStrictEqual(
        Enumerable.create([1, 1, 2, 3, 2]).distinct().toArray(),
        [1, 2, 3],
      );

      // Object distinct with custom comparer
      class PersonComparer extends EqualityComparer<{ id: number }> {
        equals(x?: { id: number }, y?: { id: number }): boolean {
          return x?.id === y?.id;
        }
      }

      const people = [
        { id: 1, name: "John" },
        { id: 1, name: "Jane" },
        { id: 2, name: "Bob" },
      ];

      assert.deepStrictEqual(
        Enumerable.create(people).distinct(new PersonComparer()).toArray(),
        [
          { id: 1, name: "John" },
          { id: 2, name: "Bob" },
        ],
      );
    });
    test("distinctBy", async () => {
      // Basic property selection
      const items = [
        { id: 1, name: "John" },
        { id: 1, name: "Jane" },
        { id: 2, name: "Bob" },
      ];

      assert.deepStrictEqual(
        Enumerable.create(items)
          .distinctBy((x) => x.id)
          .toArray(),
        [
          { id: 1, name: "John" },
          { id: 2, name: "Bob" },
        ],
      );

      // Case insensitive name comparison
      class CaseInsensitiveComparer extends EqualityComparer<string> {
        equals(x?: string, y?: string): boolean {
          return (x || "").toLowerCase() === (y || "").toLowerCase();
        }
      }

      const names = [
        { name: "John", age: 25 },
        { name: "JOHN", age: 30 },
        { name: "Bob", age: 35 },
      ];

      assert.deepStrictEqual(
        Enumerable.create(names)
          .distinctBy((x) => x.name, new CaseInsensitiveComparer())
          .toArray(),
        [
          { name: "John", age: 25 },
          { name: "Bob", age: 35 },
        ],
      );
    });
    test("elementAt", async () => {
      // Basic index access
      assert.strictEqual(Enumerable.create([1, 2, 3]).elementAt(1), 2);

      // Object access
      assert.deepStrictEqual(
        Enumerable.create([{ id: 1 }, { id: 2 }]).elementAt(0),
        { id: 1 },
      );

      // Out of range throws
      assert.throws(
        () => Enumerable.create([1]).elementAt(1),
        OutOfRangeException,
      );

      // Empty sequence throws
      assert.throws(
        () => Enumerable.create([]).elementAt(0),
        OutOfRangeException,
      );
    });
    test("elementAtOrDefault", async () => {
      // Valid index
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).elementAtOrDefault(0, 1),
        2,
      );

      // Out of range returns default
      assert.strictEqual(
        Enumerable.create([1, 2]).elementAtOrDefault(999, 5),
        999,
      );

      // Empty sequence returns default
      assert.strictEqual(
        Enumerable.create<number>([]).elementAtOrDefault(0, 0),
        0,
      );

      // With objects
      const defaultObj = { id: 0, name: "default" };
      const objectResult = Enumerable.create([
        { id: 1, name: "one" },
      ]).elementAtOrDefault(defaultObj, 1);
      assert.deepStrictEqual(objectResult, defaultObj);
    });
    test("except", async () => {
      // Basic number difference
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).except([2, 3, 4]).toArray(),
        [1],
      );

      // With custom comparer
      class PersonComparer extends EqualityComparer<{ id: number }> {
        equals(x?: { id: number }, y?: { id: number }): boolean {
          return x?.id === y?.id;
        }
      }

      const seq1 = [{ id: 1 }, { id: 2 }];
      const seq2 = [{ id: 2 }, { id: 3 }];

      assert.deepStrictEqual(
        Enumerable.create(seq1).except(seq2, new PersonComparer()).toArray(),
        [{ id: 1 }],
      );
    });
    test("exceptBy", async () => {
      // Basic key selection
      const items = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const excludeIds = [2, 3];

      assert.deepStrictEqual(
        Enumerable.create(items)
          .exceptBy(excludeIds, (x) => x.id)
          .toArray(),
        [{ id: 1, name: "John" }],
      );

      // Case insensitive comparison
      class CaseInsensitiveComparer extends EqualityComparer<string> {
        equals(x?: string, y?: string): boolean {
          return (x || "").toLowerCase() === (y || "").toLowerCase();
        }
      }

      const names = [{ name: "John" }, { name: "JANE" }];
      const excludeNames = ["jane", "bob"];

      const nameResult = Enumerable.create(names)
        .exceptBy(excludeNames, (x) => x.name, new CaseInsensitiveComparer())
        .toArray();
      assert.deepStrictEqual(nameResult, [{ name: "John" }]);
    });
    test("exclusive", async () => {
      // Basic number difference
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).exclusive([2, 3, 4]).toArray(),
        [1, 4],
      );

      // Object comparison
      class PersonComparer extends EqualityComparer<{ id: number }> {
        equals(x?: { id: number }, y?: { id: number }): boolean {
          return x?.id === y?.id;
        }
      }

      const seq1 = [{ id: 1 }, { id: 2 }];
      const seq2 = [{ id: 2 }, { id: 3 }];

      const objectResult = Enumerable.create(seq1)
        .exclusive(seq2, new PersonComparer())
        .toArray();
      assert.deepStrictEqual(objectResult, [{ id: 1 }, { id: 3 }]);
    });
    test("exclusiveBy", async () => {
      // Basic key selection
      const seq1 = [
        { id: 1, val: "a" },
        { id: 2, val: "b" },
      ];
      const seq2 = [
        { id: 2, val: "c" },
        { id: 3, val: "d" },
      ];

      assert.deepStrictEqual(
        Enumerable.create(seq1)
          .exclusiveBy(seq2, (x) => x.id)
          .toArray(),
        [
          { id: 1, val: "a" },
          { id: 3, val: "d" },
        ],
      );

      // Case insensitive comparison
      class CaseInsensitiveComparer extends EqualityComparer<string> {
        equals(x?: string, y?: string): boolean {
          return (x || "").toLowerCase() === (y || "").toLowerCase();
        }
      }

      const names1 = [{ name: "John" }, { name: "JANE" }];
      const names2 = [{ name: "jane" }, { name: "Bob" }];

      const nameResult = Enumerable.create(names1)
        .exclusiveBy(names2, (x) => x.name, new CaseInsensitiveComparer())
        .toArray();
      assert.deepStrictEqual(nameResult, [{ name: "John" }, { name: "Bob" }]);
    });
    test("first", async () => {
      // First element without predicate
      assert.strictEqual(Enumerable.create([1, 2, 3]).first(), 1);

      // First element matching predicate
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).first((x) => x > 1),
        2,
      );

      // Empty sequence throws
      assert.throws(() => Enumerable.create([]).first(), NoElementsException);

      // No matches throws
      assert.throws(
        () => Enumerable.create([1, 2]).first((x) => x > 5),
        NoElementsSatisfyCondition,
      );
    });
    test("firstOrDefault", async () => {
      // First element from non-empty sequence
      assert.strictEqual(Enumerable.create([1, 2]).firstOrDefault(0), 1);

      // Default from empty sequence
      assert.strictEqual(Enumerable.create<number>([]).firstOrDefault(0), 0);

      // First matching element with predicate
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).firstOrDefault(0, (x) => x > 2),
        3,
      );

      // Default when no matches
      assert.strictEqual(
        Enumerable.create([1, 2]).firstOrDefault(0, (x) => x > 5),
        0,
      );

      // Object sequence with default
      const defaultPerson = { id: 0, name: "default" };
      assert.deepStrictEqual(
        Enumerable.create<typeof defaultPerson>([]).firstOrDefault(
          defaultPerson,
        ),
        defaultPerson,
      );
    });
    test("forEach", async () => {
      // Basic transformation
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3])
          .forEach((x) => x * 2)
          .toArray(),
        [2, 4, 6],
      );

      // Object transformation
      const objectResult = Enumerable.create([{ value: 1 }, { value: 2 }])
        .forEach((x) => ({ doubled: x.value * 2 }))
        .toArray();
      assert.deepStrictEqual(objectResult, [{ doubled: 2 }, { doubled: 4 }]);

      // Side effects with tracking
      const logged: Array<number> = [];
      Enumerable.create([1, 2])
        .forEach((x) => {
          logged.push(x);
          return x;
        })
        .toArray();
      assert.deepStrictEqual(logged, [1, 2]);
    });
    test("groupBy", async () => {
      // Basic number grouping
      const numbers = [1, 2, 3, 4, 5];
      const numberGroups = Enumerable.create(numbers)
        .groupBy((x) => x % 2)
        .select((g) => ({ key: g.key, values: g.toArray() }))
        .toArray();

      assert.deepStrictEqual(numberGroups, [
        { key: 1, values: [1, 3, 5] },
        { key: 0, values: [2, 4] },
      ]);

      // Object grouping with sum
      const items = [
        { category: "A", value: 1 },
        { category: "B", value: 2 },
        { category: "A", value: 3 },
      ];

      const categoryGroups = Enumerable.create(items)
        .groupBy((x) => x.category)
        .select((g) => ({
          category: g.key,
          sum: g.sum((x) => x.value),
        }))
        .toArray();

      assert.deepStrictEqual(categoryGroups, [
        { category: "A", sum: 4 },
        { category: "B", sum: 2 },
      ]);

      // Group and transform objects
      const orders = [
        { id: 1, category: "A", amount: 100 },
        { id: 2, category: "B", amount: 200 },
        { id: 3, category: "A", amount: 300 },
      ];

      const groupResult = Enumerable.create(orders)
        .groupBy(
          (x) => x.category,
          (x) => ({ orderId: x.id, value: x.amount }),
        )
        .select((g) => ({
          category: g.key,
          orders: g.toArray(),
        }))
        .toArray();

      assert.deepStrictEqual(groupResult, [
        {
          category: "A",
          orders: [
            { orderId: 1, value: 100 },
            { orderId: 3, value: 300 },
          ],
        },
        {
          category: "B",
          orders: [{ orderId: 2, value: 200 }],
        },
      ]);
      // Group with result selector
      const orders2 = [
        { id: 1, category: "A", amount: 100 },
        { id: 2, category: "B", amount: 200 },
        { id: 3, category: "A", amount: 300 },
      ];

      const orderGroups = Enumerable.create(orders2)
        .groupBy(
          (x) => x.category,
          (x) => x.amount,
          (key, elements) => ({
            category: key,
            totalAmount: elements.sum(),
            count: elements.count(),
          }),
        )
        .toArray();

      assert.deepStrictEqual(orderGroups, [
        { category: "A", totalAmount: 400, count: 2 },
        { category: "B", totalAmount: 200, count: 1 },
      ]);

      // Case insensitive comparison
      class CaseInsensitiveComparer extends EqualityComparer<string> {
        equals(x?: string, y?: string): boolean {
          return (x || "").toLowerCase() === (y || "").toLowerCase();
        }
      }

      const caseGroups = Enumerable.create(["A", "a", "B", "b"])
        .groupBy(
          (x) => x,
          undefined,
          (key, elements) => ({
            key: key,
            count: elements.count(),
          }),
          new CaseInsensitiveComparer(),
        )
        .toArray();

      assert.deepStrictEqual(caseGroups, [
        { key: "A", count: 2 },
        { key: "B", count: 2 },
      ]);
    });
    test("groupJoin", async () => {
      // Basic department-employee join
      const departments = [
        { id: 1, name: "HR" },
        { id: 2, name: "IT" },
      ];

      const employees = [
        { deptId: departments[0], name: "John" },
        { deptId: departments[0], name: "Jane" },
        { deptId: departments[1], name: "Bob" },
      ];

      const basicResult = Enumerable.create(departments)
        .groupJoin(
          employees,
          (dept) => dept,
          (emp) => emp.deptId,
          (dept, emps) => ({
            department: dept.name,
            employees: emps.select((e) => e.name).toArray(),
          }),
        )
        .toArray();

      assert.deepStrictEqual(basicResult, [
        { department: "HR", employees: ["John", "Jane"] },
        { department: "IT", employees: ["Bob"] },
      ]);
    });
    test("index", async () => {
      // Basic string indexing
      assert.deepStrictEqual(
        Enumerable.create(["a", "b", "c"]).index().toArray(),
        [
          [0, "a"],
          [1, "b"],
          [2, "c"],
        ],
      );

      // Object indexing
      assert.deepStrictEqual(
        Enumerable.create([{ id: 1 }, { id: 2 }])
          .index()
          .toArray(),
        [
          [0, { id: 1 }],
          [1, { id: 2 }],
        ],
      );

      // Empty sequence
      assert.deepStrictEqual(Enumerable.create([]).index().toArray(), []);
    });
    test("intersect", async () => {
      // Basic number intersection
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).intersect([2, 3, 4]).toArray(),
        [2, 3],
      );

      // Object intersection with custom comparer
      class PersonComparer extends EqualityComparer<{ id: number }> {
        equals(x?: { id: number }, y?: { id: number }): boolean {
          return x?.id === y?.id;
        }
      }

      const seq1 = [{ id: 1 }, { id: 2 }];
      const seq2 = [{ id: 2 }, { id: 3 }];

      assert.deepStrictEqual(
        Enumerable.create(seq1).intersect(seq2, new PersonComparer()).toArray(),
        [{ id: 2 }],
      );
    });
    test("intersectBy", async () => {
      // Basic key selection
      const items = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];
      const ids = [2, 3];

      assert.deepStrictEqual(
        Enumerable.create(items)
          .intersectBy(ids, (x) => x.id)
          .toArray(),
        [{ id: 2, name: "Jane" }],
      );

      // Case insensitive comparison
      class CaseInsensitiveComparer extends EqualityComparer<string> {
        equals(x?: string, y?: string): boolean {
          return (x || "").toLowerCase() === (y || "").toLowerCase();
        }
      }

      const names = [{ name: "John" }, { name: "JANE" }];
      const filter = ["jane", "bob"];

      const nameResult = Enumerable.create(names)
        .intersectBy(filter, (x) => x.name, new CaseInsensitiveComparer())
        .toArray();
      assert.deepStrictEqual(nameResult, [{ name: "JANE" }]);
    });
    test("isDisjointFrom", async () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isDisjointFrom([4, 5, 6]),
        true,
      );
    });
    test("isSubsetOf", async () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isSubsetOf([1, 2, 3, 4, 5]),
        true,
      );
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isSubsetOf([1, 2, 4, 5, 6]),
        false,
      );
    });
    test("isSupersetOf", async () => {
      assert.strictEqual(
        Enumerable.create([1, 2, 3, 4, 5]).isSupersetOf([1, 2, 3]),
        true,
      );
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).isSupersetOf([1, 2, 3, 4, 5]),
        false,
      );
    });
    test("join", async () => {
      // Basic order-customer join
      const orders = [
        { id: 1, customerId: 1, total: 100 },
        { id: 2, customerId: 2, total: 200 },
        { id: 3, customerId: 1, total: 300 },
      ];

      const customers = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];

      const joinResult = Enumerable.create(orders)
        .join(
          customers,
          (order) => order.customerId,
          (customer) => customer.id,
          (order, customer) => ({
            orderId: order.id,
            customerName: customer.name,
            total: order.total,
          }),
        )
        .toArray();

      assert.deepStrictEqual(joinResult, [
        { orderId: 1, customerName: "John", total: 100 },
        { orderId: 2, customerName: "Jane", total: 200 },
        { orderId: 3, customerName: "John", total: 300 },
      ]);
    });
    test("last", async () => {
      // Last element
      assert.strictEqual(Enumerable.create([1, 2, 3]).last(), 3);

      // Last matching element
      assert.strictEqual(
        Enumerable.create([1, 2, 3, 2]).last((x) => x === 2),
        2,
      );

      // Empty sequence throws
      assert.throws(() => Enumerable.create([]).last(), NoElementsException);

      // No matches throws
      assert.throws(
        () => Enumerable.create([1, 2]).last((x) => x > 5),
        NoElementsSatisfyCondition,
      );
    });
    test("lastOrDefault", async () => {
      // Last element from sequence
      assert.strictEqual(Enumerable.create([1, 2]).lastOrDefault(0), 2);

      // Default from empty sequence
      assert.strictEqual(Enumerable.create<number>([]).lastOrDefault(0), 0);

      // Last matching with predicate
      assert.strictEqual(
        Enumerable.create([1, 2, 3, 2]).lastOrDefault(0, (x) => x === 2),
        2,
      );

      // Default when no matches
      assert.strictEqual(
        Enumerable.create([1, 2]).lastOrDefault(0, (x) => x > 5),
        0,
      );

      // With objects
      const defaultPerson = { id: 0, name: "default" };
      assert.deepStrictEqual(
        Enumerable.create<typeof defaultPerson>([]).lastOrDefault(
          defaultPerson,
        ),
        defaultPerson,
      );
    });
    test("max", async () => {
      // Basic maximum
      assert.strictEqual(Enumerable.create([1, 2, 3]).max(), 3);

      // Single element
      assert.strictEqual(Enumerable.create([1]).max(), 1);

      // Empty sequence throws
      assert.throws(() => Enumerable.create([]).max(), NoElementsException);

      // Mixed types throw
      assert.throws(
        () => Enumerable.create([1, "2"]).max(),
        InvalidElementsCollection,
      );

      // Custom object comparison
      class PersonComparer extends Comparer<{ age: number }> {
        compare(x?: { age: number }, y?: { age: number }): number {
          return (x?.age ?? 0) - (y?.age ?? 0);
        }
      }

      const people = [{ age: 25 }, { age: 30 }, { age: 20 }];

      assert.deepStrictEqual(
        Enumerable.create(people).max(new PersonComparer()),
        { age: 30 },
      );

      // Custom string length comparison
      class StringLengthComparer extends Comparer<string> {
        compare(x?: string, y?: string): number {
          return (x?.length ?? 0) - (y?.length ?? 0);
        }
      }

      assert.strictEqual(
        Enumerable.create(["a", "bbb", "cc"]).max(new StringLengthComparer()),
        "bbb",
      );

      // Object property maximum
      const items = [
        { id: 1, value: 10 },
        { id: 2, value: 30 },
        { id: 3, value: 20 },
      ];
      assert.strictEqual(
        Enumerable.create(items).max((x) => x.value),
        30,
      );

      // String length maximum
      assert.strictEqual(
        Enumerable.create(["a", "bbb", "cc"]).max((x) => x.length),
        3,
      );
    });
    test("maxBy", async () => {
      // Find object with maximum value
      const items = [
        { id: 1, value: 10, name: "A" },
        { id: 2, value: 30, name: "B" },
        { id: 3, value: 20, name: "C" },
      ];
      assert.deepStrictEqual(
        Enumerable.create(items).maxBy((x) => x.value),
        { id: 2, value: 30, name: "B" },
      );

      // With custom absolute comparer
      class AbsoluteComparer extends Comparer<number> {
        compare(x?: number, y?: number): number {
          return Math.abs(x ?? 0) - Math.abs(y ?? 0);
        }
      }

      const absItems = [{ val: -5 }, { val: 3 }];
      assert.deepStrictEqual(
        Enumerable.create(absItems).maxBy((x) => x.val, new AbsoluteComparer()),
        { val: -5 },
      );
    });
    test("min", async () => {
      // Basic minimum
      assert.strictEqual(Enumerable.create([1, 2, 3]).min(), 1);

      // Single element
      assert.strictEqual(Enumerable.create([5]).min(), 5);

      // Empty sequence throws
      assert.throws(() => Enumerable.create([]).min(), NoElementsException);

      // Mixed types throw
      assert.throws(
        () => Enumerable.create([1, "2"]).min(),
        InvalidElementsCollection,
      );

      // Custom object comparison
      class PersonComparer extends Comparer<{ age: number }> {
        compare(x?: { age: number }, y?: { age: number }): number {
          return (x?.age ?? 0) - (y?.age ?? 0);
        }
      }

      const people = [{ age: 25 }, { age: 30 }, { age: 20 }];

      assert.deepStrictEqual(
        Enumerable.create(people).min(new PersonComparer()),
        { age: 20 },
      );

      // Custom string length comparison
      class StringLengthComparer extends Comparer<string> {
        compare(x?: string, y?: string): number {
          return (x?.length ?? 0) - (y?.length ?? 0);
        }
      }

      assert.strictEqual(
        Enumerable.create(["aaa", "b", "cc"]).min(new StringLengthComparer()),
        "b",
      );

      // Object property minimum
      const items = [
        { id: 1, value: 10 },
        { id: 2, value: 30 },
        { id: 3, value: 20 },
      ];
      assert.strictEqual(
        Enumerable.create(items).min((x) => x.value),
        10,
      );

      // String length minimum
      assert.strictEqual(
        Enumerable.create(["aaa", "b", "cc"]).min((x) => x.length),
        1,
      );
    });
    test("minBy", async () => {
      // Find object with minimum value
      const items = [
        { id: 1, value: 10, name: "A" },
        { id: 2, value: 30, name: "B" },
        { id: 3, value: 20, name: "C" },
      ];
      assert.deepStrictEqual(
        Enumerable.create(items).minBy((x) => x.value),
        { id: 1, value: 10, name: "A" },
      );

      // With custom absolute comparer
      class AbsoluteComparer extends Comparer<number> {
        compare(x?: number, y?: number): number {
          return Math.abs(x ?? 0) - Math.abs(y ?? 0);
        }
      }

      const absItems = [{ val: -5 }, { val: 3 }];
      assert.deepStrictEqual(
        Enumerable.create(absItems).minBy((x) => x.val, new AbsoluteComparer()),
        { val: 3 },
      );
    });
    test("ofType", async () => {
      // Filter numbers
      assert.deepStrictEqual(
        Enumerable.create([1, "a", 2, "b", 3]).ofType("number").toArray(),
        [1, 2, 3],
      );

      // Filter strings
      assert.deepStrictEqual(
        Enumerable.create([1, "a", 2, "b"]).ofType("string").toArray(),
        ["a", "b"],
      );

      // Filter strings 2
      assert.deepStrictEqual(
        Enumerable.create([1, "a", 2, "b", new String("c")])
          .ofType(String)
          .toArray(),
        [new String("c")],
      );

      // Custom class filtering
      // eslint-disable-next-line @typescript-eslint/no-extraneous-class
      class Person {}
      const person1 = new Person();
      const person2 = new Person();
      const items = [person1, "a", person2];

      assert.deepStrictEqual(
        Enumerable.create(items).ofType(Person).toArray(),
        [person1, person2],
      );
    });
    test("order", async () => {
      // Basic ordering
      assert.deepStrictEqual(
        Enumerable.create([3, 1, 2]).order().toArray(),
        [1, 2, 3],
      );

      // String comparison
      assert.deepStrictEqual(
        Enumerable.create(["c", "a", "b"]).order("string").toArray(),
        ["a", "b", "c"],
      );

      // Custom comparison
      class PersonComparer extends Comparer<{ age: number }> {
        compare(x?: { age: number }, y?: { age: number }): number {
          return (x?.age ?? 0) - (y?.age ?? 0);
        }
      }

      const people = Enumerable.create([
        { age: 30, name: "Bob" },
        { age: 20, name: "Alice" },
      ])
        .order(new PersonComparer())
        .select((x) => x.name)
        .toArray();
      assert.deepStrictEqual(people, ["Alice", "Bob"]);
    });
    test("orderBy", async () => {
      // Basic property ordering
      const items = [
        { id: 3, name: "C" },
        { id: 1, name: "A" },
        { id: 2, name: "B" },
      ];

      const orderedNames = Enumerable.create(items)
        .orderBy((x) => x.id)
        .select((x) => x.name)
        .toArray();
      assert.deepStrictEqual(orderedNames, ["A", "B", "C"]);

      // Custom key comparison
      class CaseInsensitiveComparer extends Comparer<string> {
        compare(x?: string, y?: string): number {
          return (x || "").toLowerCase().localeCompare((y || "").toLowerCase());
        }
      }

      const names = [{ name: "bob" }, { name: "Alice" }, { name: "Charlie" }];

      const orderedByName = Enumerable.create(names)
        .orderBy((x) => x.name, new CaseInsensitiveComparer())
        .select((x) => x.name)
        .toArray();
      assert.deepStrictEqual(orderedByName, ["Alice", "bob", "Charlie"]);
    });
    test("orderByDescending", async () => {
      // Basic descending property order
      const items = [
        { id: 1, name: "A" },
        { id: 3, name: "C" },
        { id: 2, name: "B" },
      ];

      const orderedNames = Enumerable.create(items)
        .orderByDescending((x) => x.id)
        .select((x) => x.name)
        .toArray();
      assert.deepStrictEqual(orderedNames, ["C", "B", "A"]);

      // Custom comparison
      class ReverseStringComparer extends Comparer<string> {
        compare(x?: string, y?: string): number {
          return -(x || "").localeCompare(y || "");
        }
      }

      const names = ["Alice", "Bob", "Charlie"];
      const orderedStrings = Enumerable.create(names)
        .orderByDescending((x) => x, new ReverseStringComparer())
        .toArray();
      assert.deepStrictEqual(orderedStrings, ["Alice", "Bob", "Charlie"]);
    });
    test("orderDescending", async () => {
      // Basic descending order
      assert.deepStrictEqual(
        Enumerable.create([1, 3, 2]).orderDescending().toArray(),
        [3, 2, 1],
      );

      // Custom object comparison
      class PersonComparer extends Comparer<{ age: number }> {
        compare(x?: { age: number }, y?: { age: number }): number {
          return (x?.age ?? 0) - (y?.age ?? 0);
        }
      }

      const people = [
        { age: 20, name: "Alice" },
        { age: 30, name: "Bob" },
        { age: 25, name: "Charlie" },
      ];

      const orderedPeople = Enumerable.create(people)
        .orderDescending(new PersonComparer())
        .select((x) => x.name)
        .toArray();
      assert.deepStrictEqual(orderedPeople, ["Bob", "Charlie", "Alice"]);
    });
    test("prepend", async () => {
      // Basic prepend
      assert.deepStrictEqual(
        Enumerable.create([2, 3]).prepend(1).toArray(),
        [1, 2, 3],
      );

      // Prepend to empty sequence
      assert.deepStrictEqual(
        Enumerable.create<number>([]).prepend(1).toArray(),
        [1],
      );

      // Object prepend
      const items = [{ id: 2 }, { id: 3 }];
      assert.deepStrictEqual(
        Enumerable.create(items).prepend({ id: 1 }).toArray(),
        [{ id: 1 }, { id: 2 }, { id: 3 }],
      );

      // Multiple prepends
      assert.deepStrictEqual(
        Enumerable.create([3]).prepend(2).prepend(1).toArray(),
        [1, 2, 3],
      );
    });
    test("reverse", async () => {
      // Basic number reversal
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).reverse().toArray(),
        [3, 2, 1],
      );

      // String reversal
      assert.deepStrictEqual(
        Enumerable.create(["a", "b", "c"]).reverse().toArray(),
        ["c", "b", "a"],
      );

      // Object reversal
      const items = [
        { id: 1, value: "first" },
        { id: 2, value: "second" },
      ];
      const objectResult = Enumerable.create(items)
        .reverse()
        .select((x) => x.value)
        .toArray();
      assert.deepStrictEqual(objectResult, ["second", "first"]);
    });
    test("select", async () => {
      // Basic transformation
      const numberResult = Enumerable.create([1, 2, 3])
        .select((x) => x * 2)
        .toArray();
      assert.deepStrictEqual(numberResult, [2, 4, 6]);

      // Using index
      const indexResult = Enumerable.create(["a", "b", "c"])
        .select((x, i) => `${i}:${x}`)
        .toArray();
      assert.deepStrictEqual(indexResult, ["0:a", "1:b", "2:c"]);

      // Object transformation
      const items = [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ];

      const objectResult = Enumerable.create(items)
        .select((x) => ({
          userId: x.id,
          displayName: x.name.toUpperCase(),
        }))
        .toArray();
      assert.deepStrictEqual(objectResult, [
        { userId: 1, displayName: "JOHN" },
        { userId: 2, displayName: "JANE" },
      ]);
    });
    test("selectMany", async () => {
      // Basic array flattening
      const arrays = [
        [1, 2],
        [3, 4],
      ];
      const basicResult = Enumerable.create(arrays)
        .selectMany((x) => x)
        .toArray();
      assert.deepStrictEqual(basicResult, [1, 2, 3, 4]);

      // With result transformation
      const items = [
        { id: 1, values: [1, 2] },
        { id: 2, values: [3, 4] },
      ];

      const transformResult = Enumerable.create(items)
        .selectMany(
          (x) => x.values,
          (item, value) => ({
            id: item.id,
            value: value,
          }),
        )
        .toArray();
      assert.deepStrictEqual(transformResult, [
        { id: 1, value: 1 },
        { id: 1, value: 2 },
        { id: 2, value: 3 },
        { id: 2, value: 4 },
      ]);
    });
    test("sequenceEqual", async () => {
      // Basic number comparison
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).sequenceEqual([1, 2, 3]),
        true,
      );

      assert.strictEqual(
        Enumerable.create([1, 2]).sequenceEqual([1, 2, 3]),
        false,
      );

      // Custom object comparison
      class PersonComparer extends EqualityComparer<{ id: number }> {
        equals(x?: { id: number }, y?: { id: number }): boolean {
          return x?.id === y?.id;
        }
      }

      const seq1 = [{ id: 1 }, { id: 2 }];
      const seq2 = [{ id: 1 }, { id: 2 }];

      assert.strictEqual(
        Enumerable.create(seq1).sequenceEqual(seq2, new PersonComparer()),
        true,
      );
    });
    test("shuffle", async () => {
      // Basic number shuffling
      const numbers = [1, 2, 3, 4, 5];
      const originalNumbers = [...numbers];
      const shuffled = Enumerable.create(numbers).shuffle().toArray();

      // Verify length and elements
      assert.strictEqual(shuffled.length, numbers.length);
      assert.deepStrictEqual(numbers, originalNumbers); // Original unchanged
      assert.deepStrictEqual(shuffled.sort(), numbers.sort()); // Same elements

      // Object shuffling
      const items = [
        { id: 1, value: "A" },
        { id: 2, value: "B" },
        { id: 3, value: "C" },
      ];
      const shuffledValues = Enumerable.create(items)
        .shuffle()
        .select((x) => x.value)
        .toArray();
      assert.strictEqual(shuffledValues.length, items.length);
      assert.deepStrictEqual(shuffledValues.sort(), ["A", "B", "C"]);
    });
    test("single", async () => {
      // Single element
      assert.strictEqual(Enumerable.create([1]).single(), 1);

      // With predicate
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).single((x) => x === 2),
        2,
      );

      // Multiple elements throw
      assert.throws(
        () => Enumerable.create([1, 2]).single(),
        MoreThanOneElementSatisfiesCondition,
      );

      // Multiple matches throw
      assert.throws(
        () => Enumerable.create([1, 2, 2]).single((x) => x === 2),
        MoreThanOneElementSatisfiesCondition,
      );
    });
    test("singleOrDefault", async () => {
      // Single element returns value
      assert.strictEqual(Enumerable.create([1]).singleOrDefault(0), 1);

      // Empty sequence returns default
      assert.strictEqual(Enumerable.create<number>([]).singleOrDefault(0), 0);

      // Multiple elements throws
      assert.throws(
        () => Enumerable.create([1, 2]).singleOrDefault(0),
        MoreThanOneElementSatisfiesCondition,
      );

      // Single match with predicate
      assert.strictEqual(
        Enumerable.create([1, 2, 3]).singleOrDefault(0, (x) => x === 2),
        2,
      );

      // Multiple matches throws
      assert.throws(
        () => Enumerable.create([1, 2, 2]).singleOrDefault(0, (x) => x === 2),
        MoreThanOneElementSatisfiesCondition,
      );
    });
    test("skip", async () => {
      // Basic skip
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3, 4]).skip(2).toArray(),
        [3, 4],
      );

      // Skip more than length
      assert.deepStrictEqual(Enumerable.create([1, 2]).skip(5).toArray(), []);

      // Skip with negative count
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).skip(-1).toArray(),
        [1, 2, 3],
      );

      // Skip with objects
      const items = [
        { id: 1, value: "A" },
        { id: 2, value: "B" },
        { id: 3, value: "C" },
      ];
      const objectResult = Enumerable.create(items)
        .skip(1)
        .select((x) => x.value)
        .toArray();
      assert.deepStrictEqual(objectResult, ["B", "C"]);
    });
    test("skipLast", async () => {
      // Basic skip last
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3, 4]).skipLast(2).toArray(),
        [1, 2],
      );

      // Skip more than length
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).skipLast(5).toArray(),
        [],
      );

      // Skip with negative count
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).skipLast(-1).toArray(),
        [1, 2, 3],
      );

      // Skip with objects
      const items = [
        { id: 1, value: "A" },
        { id: 2, value: "B" },
        { id: 3, value: "C" },
      ];
      const objectResult = Enumerable.create(items)
        .skipLast(1)
        .select((x) => x.value)
        .toArray();
      assert.deepStrictEqual(objectResult, ["A", "B"]);
    });
    test("skipWhile", async () => {
      // Skip while less than 3
      const numberResult = Enumerable.create([1, 2, 3, 4, 2])
        .skipWhile((x) => x < 3)
        .toArray();
      assert.deepStrictEqual(numberResult, [3, 4, 2]);

      // Using index in predicate
      const indexResult = Enumerable.create([1, 2, 3, 4])
        .skipWhile((x, i) => i < 2)
        .toArray();
      assert.deepStrictEqual(indexResult, [3, 4]);

      // Object sequence
      const items = [
        { value: 1, name: "A" },
        { value: 2, name: "B" },
        { value: 3, name: "C" },
        { value: 1, name: "D" },
      ];
      const objectResult = Enumerable.create(items)
        .skipWhile((x) => x.value < 3)
        .select((x) => x.name)
        .toArray();
      assert.deepStrictEqual(objectResult, ["C", "D"]);
    });
    test("sum", async () => {
      // Number sum
      assert.strictEqual(Enumerable.create([1, 2, 3]).sum(), 6);

      // String concatenation
      assert.strictEqual(Enumerable.create(["a", "b", "c"]).sum(), "abc");

      // Empty sequence throws
      assert.throws(() => Enumerable.create([]).sum(), NoElementsException);

      // Mixed types throw
      assert.throws(
        () => Enumerable.create([1, "2"]).sum(),
        InvalidElementsCollection,
      );

      // Basic string concatenation
      const textItems = [
        { id: 1, text: "Hello" },
        { id: 2, text: " " },
        { id: 3, text: "World" },
      ];
      assert.strictEqual(
        Enumerable.create(textItems).sum((x) => x.text),
        "Hello World",
      );

      // Empty sequence throws
      assert.throws(
        () => Enumerable.create([]).sum((x) => x),
        NoElementsException,
      );

      // Sum of extracted values
      const items = [
        { id: 1, value: 10 },
        { id: 2, value: 20 },
        { id: 3, value: 30 },
      ];
      assert.strictEqual(
        Enumerable.create(items).sum((x) => x.value),
        60,
      );

      // String length sum
      assert.strictEqual(
        Enumerable.create(["a", "bb", "ccc"]).sum((x) => x.length),
        6,
      );
    });
    test("take", async () => {
      // Basic take
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3, 4]).take(2).toArray(),
        [1, 2],
      );

      // Take more than available
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).take(5).toArray(),
        [1, 2],
      );

      // Take with negative count
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).take(-1).toArray(),
        [],
      );

      // Take with objects
      const items = [
        { id: 1, value: "A" },
        { id: 2, value: "B" },
        { id: 3, value: "C" },
      ];
      const objectResult = Enumerable.create(items)
        .take(2)
        .select((x) => x.value)
        .toArray();
      assert.deepStrictEqual(objectResult, ["A", "B"]);
    });
    test("takeLast", async () => {
      // Basic take last
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3, 4]).takeLast(2).toArray(),
        [3, 4],
      );

      // Take more than available
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).takeLast(5).toArray(),
        [1, 2],
      );

      // Take with negative count
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).takeLast(-1).toArray(),
        [],
      );

      // Take with objects
      const items = [
        { id: 1, value: "A" },
        { id: 2, value: "B" },
        { id: 3, value: "C" },
      ];
      const objectResult = Enumerable.create(items)
        .takeLast(2)
        .select((x) => x.value)
        .toArray();
      assert.deepStrictEqual(objectResult, ["B", "C"]);
    });
    test("takeWhile", async () => {
      // Take while less than 3
      const numberResult = Enumerable.create([1, 2, 3, 4, 1])
        .takeWhile((x) => x < 3)
        .toArray();
      assert.deepStrictEqual(numberResult, [1, 2]);

      // Using index in predicate
      const indexResult = Enumerable.create([1, 2, 3, 4])
        .takeWhile((x, i) => i < 2)
        .toArray();
      assert.deepStrictEqual(indexResult, [1, 2]);

      // Object sequence
      const items = [
        { value: 1, name: "A" },
        { value: 2, name: "B" },
        { value: 3, name: "C" },
        { value: 1, name: "D" },
      ];
      const objectResult = Enumerable.create(items)
        .takeWhile((x) => x.value < 3)
        .select((x) => x.name)
        .toArray();
      assert.deepStrictEqual(objectResult, ["A", "B"]);
    });
    test("toArray", async () => {
      // Basic conversion
      assert.deepStrictEqual(Enumerable.create([1, 2, 3]).toArray(), [1, 2, 3]);

      // Empty sequence
      assert.deepStrictEqual(Enumerable.create([]).toArray(), []);

      // Object sequence
      const items = [
        { id: 1, value: "A" },
        { id: 2, value: "B" },
      ];
      const objectResult = Enumerable.create(items)
        .select((x) => x.value)
        .toArray();
      assert.deepStrictEqual(objectResult, ["A", "B"]);
    });
    test("toMap", async () => {
      // Group by number
      const items = [
        { category: 1, name: "A" },
        { category: 2, name: "B" },
        { category: 1, name: "C" },
      ];
      const numberMap = Enumerable.create(items).toMap((x) => x.category);

      assert.deepStrictEqual(numberMap.get(1), [
        { category: 1, name: "A" },
        { category: 1, name: "C" },
      ]);
      assert.deepStrictEqual(numberMap.get(2), [{ category: 2, name: "B" }]);

      // Group by string
      const people = [
        { dept: "IT", name: "John" },
        { dept: "HR", name: "Jane" },
        { dept: "IT", name: "Bob" },
      ];
      const deptMap = Enumerable.create(people).toMap((x) => x.dept);

      assert.deepStrictEqual(deptMap.get("IT"), [
        { dept: "IT", name: "John" },
        { dept: "IT", name: "Bob" },
      ]);
      assert.deepStrictEqual(deptMap.get("HR"), [{ dept: "HR", name: "Jane" }]);
    });
    test("toSet", async () => {
      // Basic conversion with duplicates
      const numberSet = Enumerable.create([1, 2, 2, 3]).toSet();
      assert.strictEqual(numberSet.size, 3);
      assert.ok(numberSet.has(1));
      assert.ok(numberSet.has(2));
      assert.ok(numberSet.has(3));

      // Empty sequence
      assert.strictEqual(Enumerable.create([]).toSet().size, 0);

      // Object sequence with value duplicates
      const items = [
        { id: 1, name: "A" },
        { id: 1, name: "A" }, // Duplicate by value
        { id: 2, name: "B" },
      ];
      assert.strictEqual(Enumerable.create(items).toSet().size, 3); // Different references
    });
    test("union", async () => {
      // Basic number union
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).union([2, 3]).toArray(),
        [1, 2, 3],
      );

      // Custom object comparison
      class PersonComparer extends EqualityComparer<{ id: number }> {
        equals(x?: { id: number }, y?: { id: number }): boolean {
          return x?.id === y?.id;
        }
      }

      const seq1 = [{ id: 1 }, { id: 2 }];
      const seq2 = [{ id: 2 }, { id: 3 }];

      const objectResult = Enumerable.create(seq1)
        .union(seq2, new PersonComparer())
        .select((x) => x.id)
        .toArray();
      assert.deepStrictEqual(objectResult, [1, 2, 3]);
    });
    test("unionBy", async () => {
      // Basic key-based union
      const seq1 = [
        { id: 1, val: "A" },
        { id: 2, val: "B" },
      ];
      const seq2 = [
        { id: 2, val: "C" },
        { id: 3, val: "D" },
      ];

      const basicResult = Enumerable.create(seq1)
        .unionBy(seq2, (x) => x.id)
        .select((x) => x.val)
        .toArray();
      assert.deepStrictEqual(basicResult, ["A", "B", "D"]);

      // Case insensitive name union
      class CaseInsensitiveComparer extends EqualityComparer<string> {
        equals(x?: string, y?: string): boolean {
          return (x || "").toLowerCase() === (y || "").toLowerCase();
        }
      }

      const names1 = [{ name: "John" }, { name: "JANE" }];
      const names2 = [{ name: "jane" }, { name: "Bob" }];

      const nameResult = Enumerable.create(names1)
        .unionBy(names2, (x) => x.name, new CaseInsensitiveComparer())
        .select((x) => x.name)
        .toArray();
      assert.deepStrictEqual(nameResult, ["John", "JANE", "Bob"]);
    });
    test("where", async () => {
      // Basic number filtering
      const numberResult = Enumerable.create([1, 2, 3, 4])
        .where((x) => x > 2)
        .toArray();
      assert.deepStrictEqual(numberResult, [3, 4]);

      // Using index in predicate
      const indexResult = Enumerable.create(["a", "b", "c"])
        .where((x, i) => i % 2 === 0)
        .toArray();
      assert.deepStrictEqual(indexResult, ["a", "c"]);

      // Object filtering
      const items = [
        { id: 1, active: true },
        { id: 2, active: false },
        { id: 3, active: true },
      ];
      const objectResult = Enumerable.create(items)
        .where((x) => x.active)
        .select((x) => x.id)
        .toArray();
      assert.deepStrictEqual(objectResult, [1, 3]);
    });
    test("zip", async () => {
      // Basic number and string zip
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).zip(["a", "b", "c"]).toArray(),
        [
          [1, "a"],
          [2, "b"],
          [3, "c"],
        ],
      );

      // Unequal lengths
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).zip(["a", "b", "c"]).toArray(),
        [
          [1, "a"],
          [2, "b"],
        ],
      );

      // Object zip
      const numbers = [1, 2];
      const letters = ["A", "B"];

      const objectResult = Enumerable.create(numbers)
        .zip(letters)
        .select(([num, letter]) => ({
          number: num,
          letter: letter,
        }))
        .toArray();
      assert.deepStrictEqual(objectResult, [
        { number: 1, letter: "A" },
        { number: 2, letter: "B" },
      ]);
      // Combine numbers and strings
      const formatResult = Enumerable.create([1, 2, 3])
        .zip(["a", "b", "c"], (num, letter) => `${num}-${letter}`)
        .toArray();
      assert.deepStrictEqual(formatResult, ["1-a", "2-b", "3-c"]);

      // Create objects from pairs
      const ids = [1, 2];
      const names = ["John", "Jane"];
      const objectResult2 = Enumerable.create(ids)
        .zip(names, (id, name) => ({ id, name }))
        .toArray();
      assert.deepStrictEqual(objectResult2, [
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ]);

      // Basic three-way zip
      assert.deepStrictEqual(
        Enumerable.create([1, 2]).zip(["a", "b"], [true, false]).toArray(),
        [
          [1, "a", true],
          [2, "b", false],
        ],
      );

      // Different lengths
      assert.deepStrictEqual(
        Enumerable.create([1, 2, 3]).zip(["a", "b"], [true]).toArray(),
        [[1, "a", true]],
      );

      // Object creation from triple
      const ids2 = [1, 2];
      const names2 = ["John", "Jane"];
      const ages = [25, 30];

      const objectResult3 = Enumerable.create(ids2)
        .zip(names2, ages)
        .select(([id, name, age]) => ({
          id,
          name,
          age,
        }))
        .toArray();
      assert.deepStrictEqual(objectResult3, [
        { id: 1, name: "John", age: 25 },
        { id: 2, name: "Jane", age: 30 },
      ]);
    });
  });
});
