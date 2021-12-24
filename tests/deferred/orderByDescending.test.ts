import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("orderByDescending", function () {
    const unsorted = [9, 8, 7, 6, 5, 5, 4, 3, 9, 1, 0];
    const sorted = [9, 9, 8, 7, 6, 5, 5, 4, 3, 1, 0];
    class Comparer implements Interfaces.ICompareTo<number> {
        CompareTo(x: number, y: number): number {
            return x - y;
        }
    }
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable(["b", "c", "a"]).orderByDescending().toArray()).to.be.eql(["c", "b", "a"]);
            expect(Enumerable.asEnumerable(unsorted).orderByDescending().toArray()).to.be.eql(sorted);
        });
        test("comparer", function () {
            expect(
                Enumerable.asEnumerable(unsorted)
                    .orderByDescending((x) => x, new Comparer())
                    .toArray()
            ).to.be.eql(sorted);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(["b", "c", "a"]).orderByDescending();
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderByDescending().toArray()).to.be.eql(["c", "b", "a"]);
            expect(await EnumerableAsync.asEnumerableAsync(unsorted).orderByDescending().toArray()).to.be.eql(sorted);
        });
        test("comparer", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync(unsorted)
                    .orderByDescending((x) => x, new Comparer())
                    .toArray()
            ).to.be.eql(sorted);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderByDescending();
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
    describe("EnumerableAsync async", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(["b", "c", "a"]).orderByDescending().toArray()).to.be.eql(["c", "b", "a"]);
            expect(await EnumerableAsync.asEnumerableAsync(unsorted).orderByDescending().toArray()).to.be.eql(sorted);
        });
        test("comparer", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync(unsorted)
                    .orderByDescending(async (x) => Promise.resolve(x), new Comparer())
                    .toArray()
            ).to.be.eql(sorted);
        });
    });
});
