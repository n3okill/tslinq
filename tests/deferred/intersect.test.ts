import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("intersect", function () {
    class Comparer<T> implements Interfaces.IEqualityComparer<T> {
        Equals(x: T, y: T): boolean {
            return x == y;
        }
    }
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 2, 3, 4, 5, 5, 6]).intersect([1, 1, 3, 3, 5]).toArray()).to.be.eql([1, 3, 5]);
            expect(
                Enumerable.asEnumerable([1, 2, 3])
                    .intersect(["1", "2"] as unknown as Array<number>, new Comparer())
                    .toArray()
            ).to.be.eql([1, 2]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 2, 3, 4, 5, 5, 6]).intersect([1, 1, 3, 3, 5]);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 2, 3, 4, 5, 5, 6]).intersect([1, 1, 3, 3, 5]).toArray()).to.be.eql([1, 3, 5]);
            expect(
                await EnumerableAsync.asEnumerableAsync([1, 2, 3])
                    .intersect(["1", "2"] as unknown as Array<number>, new Comparer())
                    .toArray()
            ).to.be.eql([1, 2]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 2, 3, 4, 5, 5, 6]).intersect([1, 1, 3, 3, 5]);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
