import { Enumerable, EnumerableAsync, Exceptions, Interfaces } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("max", function () {
    class Comparer<T> extends Interfaces.ICompareTo<T> {
        CompareTo(x: T, y: T): -1 | 0 | 1 {
            return x > y ? -1 : x < y ? 1 : 0;
        }
    }
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).max()).to.equal(3);
            expect(
                Enumerable.asEnumerable([1, 2, 3])
                    .select((x) => x * x)
                    .max()
            ).to.equal(9);
            expect(Enumerable.asEnumerable([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).max()).to.equal(Number.POSITIVE_INFINITY);
        });
        test("exceptions", function () {
            expect(() => Enumerable.asEnumerable([]).max()).to.throw(Exceptions.ThrowNoElementsException);
        });
        test("comparer", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).max(new Comparer())).to.equal(1);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.max()).to.equal(e.max());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).max()).to.equal(3);
            expect(
                await EnumerableAsync.asEnumerableAsync([1, 2, 3])
                    .select((x) => x * x)
                    .max()
            ).to.equal(9);
            expect(await EnumerableAsync.asEnumerableAsync([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).max()).to.equal(Number.POSITIVE_INFINITY);
        });
        test("exceptions", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([]).max()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
        });
        test("comparer", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).max(new Comparer())).to.equal(1);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.max()).to.equal(await e.max());
        });
    });
    describe("EnumerableAsync async comparer", function () {
        test("comparer", async function () {
            class ComparerAsync<T> extends Interfaces.IAsyncCompareTo<T> {
                CompareTo(x: T, y: T): Promise<-1 | 0 | 1> {
                    return Promise.resolve(x > y ? -1 : x < y ? 1 : 0);
                }
            }
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).max(new ComparerAsync())).to.equal(1);
        });
    });
});
