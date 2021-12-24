import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("thenByDescending", function () {
    class Comparer extends Intl.Collator implements Interfaces.ICompareTo<string> {
        CompareTo = (x: string, y?: string) => super.compare(x, y as string);
    }

    const fruits = ["apPLe", "baNanA", "apple", "APple", "orange", "BAnana", "ORANGE", "apPLE"];
    const result = ["apPLe", "apple", "APple", "apPLE", "orange", "ORANGE", "baNanA", "BAnana"];
    describe("Enumerable", function () {
        test("basic", function () {
            const e = Enumerable.asEnumerable(fruits)
                .orderBy((fruit) => fruit.length)
                .thenByDescending((fruit) => fruit, new Comparer(undefined, { sensitivity: "base" }));
            expect(e.toArray()).to.be.eql(result);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(fruits)
                .orderBy((fruit) => fruit.length)
                .thenByDescending((fruit) => fruit, new Comparer(undefined, { sensitivity: "base" }));
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync(fruits)
                .orderBy((fruit) => fruit.length)
                .thenByDescending((fruit) => fruit, new Comparer(undefined, { sensitivity: "base" }));
            expect(await e.toArray()).to.be.eql(result);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync(fruits)
                .orderBy((fruit) => fruit.length)
                .thenByDescending((fruit) => fruit, new Comparer(undefined, { sensitivity: "base" }));
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
    describe("EnumerableAsync async", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync(fruits)
                .orderBy(async (fruit) => Promise.resolve(fruit.length))
                .thenByDescending(async (fruit) => Promise.resolve(fruit), new Comparer(undefined, { sensitivity: "base" }));
            expect(await e.toArray()).to.be.eql(result);
        });
    });
});
