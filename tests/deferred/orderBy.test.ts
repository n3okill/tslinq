import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("orderBy", function () {
    const unsorted = [9, 8, 7, 6, 5, 5, 4, 3, 9, 1, 0];
    const sorted = [0, 1, 3, 4, 5, 5, 6, 7, 8, 9, 9];
    class Comparer implements Interfaces.ICompareTo<number> {
        CompareTo(x: number, y: number): number {
            return x - y;
        }
    }
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable(["b", "c", "a"]).orderBy().toArray()).to.be.eql(["a", "b", "c"]);
            expect(Enumerable.asEnumerable(unsorted).orderBy().toArray()).to.be.eql(sorted);
        });
        test("comparer", function () {
            expect(
                Enumerable.asEnumerable(unsorted)
                    .orderBy((x) => x, new Comparer())
                    .toArray()
            ).to.be.eql(sorted);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(["b", "c", "a"]).orderBy();
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderBy().toArray()).to.be.eql(["a", "b", "c"]);
            expect(await EnumerableAsync.asEnumerableAsync(unsorted).orderBy().toArray()).to.be.eql(sorted);
        });
        test("comparer", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync(unsorted)
                    .orderBy((x) => x, new Comparer())
                    .toArray()
            ).to.be.eql(sorted);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderBy();
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
    describe("EnumerableAsync async", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderBy().toArray()).to.be.eql(["a", "b", "c"]);
            expect(await EnumerableAsync.asEnumerableAsync(unsorted).orderBy().toArray()).to.be.eql(sorted);
        });
        test("comparer", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync(unsorted)
                    .orderBy(async (x) => Promise.resolve(x), new Comparer())
                    .toArray()
            ).to.be.eql(sorted);
        });
    });
});
