import { Enumerable, EnumerableAsync, Exceptions, Interfaces } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("minBy", function () {
    class Comparer<T> extends Interfaces.ICompareTo<T> {
        CompareTo(x: T, y: T): -1 | 0 | 1 {
            return x > y ? -1 : x < y ? 1 : 0;
        }
    }
    class Person {
        constructor(public name: string, public age: number) {}
    }
    const persons = [new Person("Tom", 43), new Person("Dick", 55), new Person("Harry", 20)];
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).minBy()).to.equal(1);
            expect(
                Enumerable.asEnumerable([1, 2, 3])
                    .select((x) => x * x)
                    .minBy()
            ).to.equal(1);
            expect(Enumerable.asEnumerable([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).minBy()).to.equal(Number.NEGATIVE_INFINITY);
            expect(Enumerable.asEnumerable(persons).minBy((x) => x.age).name).to.equal("Harry");
        });
        test("exceptions", function () {
            expect(() => Enumerable.asEnumerable([]).minBy()).to.throw(Exceptions.ThrowNoElementsException);
        });
        test("comparer", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).minBy((x) => x, new Comparer())).to.equal(3);
            expect(Enumerable.asEnumerable(persons).minBy((x) => x.age, new Comparer()).name).to.equal("Dick");
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.minBy()).to.equal(e.minBy());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).minBy()).to.equal(1);
            expect(
                await EnumerableAsync.asEnumerableAsync([1, 2, 3])
                    .select((x) => x * x)
                    .minBy()
            ).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).minBy()).to.equal(Number.NEGATIVE_INFINITY);
            expect((await EnumerableAsync.asEnumerableAsync(persons).minBy((x) => x.age)).name).to.equal("Harry");
        });
        test("exceptions", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([]).minBy()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
        });
        test("comparer", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).minBy((x) => x, new Comparer())).to.equal(3);
            expect((await EnumerableAsync.asEnumerableAsync(persons).minBy((x) => x.age, new Comparer())).name).to.equal("Dick");
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.minBy()).to.equal(await e.minBy());
        });
    });
    describe("EnumerableAsync async comparer", function () {
        test("comparer", async function () {
            class ComparerAsync<T> extends Interfaces.IAsyncCompareTo<T> {
                CompareTo(x: T, y: T): Promise<-1 | 0 | 1> {
                    return Promise.resolve(x > y ? -1 : x < y ? 1 : 0);
                }
            }
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).minBy((x) => x, new ComparerAsync())).to.equal(3);
        });
    });
});
