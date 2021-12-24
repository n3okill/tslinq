import { Enumerable, EnumerableAsync, Exceptions, Interfaces } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("min", function () {
    class Comparer<T> extends Interfaces.ICompareTo<T> {
        CompareTo(x: T, y: T): -1 | 0 | 1 {
            return x > y ? -1 : x < y ? 1 : 0;
        }
    }
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).min()).to.equal(1);
            expect(
                Enumerable.asEnumerable([1, 2, 3])
                    .select((x) => x * x)
                    .min()
            ).to.equal(1);
            expect(Enumerable.asEnumerable([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).min()).to.equal(Number.NEGATIVE_INFINITY);
        });
        test("exceptions", function () {
            expect(() => Enumerable.asEnumerable([]).min()).to.throw(Exceptions.ThrowNoElementsException);
        });
        test("comparer", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).min(new Comparer())).to.equal(3);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.min()).to.equal(e.min());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).min()).to.equal(1);
            expect(
                await EnumerableAsync.asEnumerableAsync([1, 2, 3])
                    .select((x) => x * x)
                    .min()
            ).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).min()).to.equal(Number.NEGATIVE_INFINITY);
        });
        test("exceptions", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([]).min()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
        });
        test("comparer", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).min(new Comparer())).to.equal(3);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.min()).to.equal(await e.min());
        });
    });
    describe("EnumerableAsync async comparer", function () {
        test("comparer", async function () {
            class ComparerAsync<T> extends Interfaces.IAsyncCompareTo<T> {
                CompareTo(x: T, y: T): Promise<-1 | 0 | 1> {
                    return Promise.resolve(x > y ? -1 : x < y ? 1 : 0);
                }
            }
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).min(new ComparerAsync())).to.equal(3);
        });
    });
});
