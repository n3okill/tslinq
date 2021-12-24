import { Enumerable, EnumerableAsync, Exceptions, Interfaces } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("maxBy", function () {
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
            expect(Enumerable.asEnumerable([1, 2, 3]).maxBy()).to.equal(3);
            expect(
                Enumerable.asEnumerable([1, 2, 3])
                    .select((x) => x * x)
                    .maxBy()
            ).to.equal(9);
            expect(Enumerable.asEnumerable([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).maxBy()).to.equal(Number.POSITIVE_INFINITY);
            expect(Enumerable.asEnumerable(persons).maxBy((x) => x.age).name).to.equal("Dick");
        });
        test("exceptions", function () {
            expect(() => Enumerable.asEnumerable([]).maxBy()).to.throw(Exceptions.ThrowNoElementsException);
        });
        test("comparer", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).maxBy((x) => x, new Comparer())).to.equal(1);
            expect(Enumerable.asEnumerable(persons).maxBy((x) => x.age, new Comparer()).name).to.equal("Harry");
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.maxBy()).to.equal(e.maxBy());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).maxBy()).to.equal(3);
            expect(
                await EnumerableAsync.asEnumerableAsync([1, 2, 3])
                    .select((x) => x * x)
                    .maxBy()
            ).to.equal(9);
            expect(await EnumerableAsync.asEnumerableAsync([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]).maxBy()).to.equal(Number.POSITIVE_INFINITY);
            expect((await EnumerableAsync.asEnumerableAsync(persons).maxBy((x) => x.age)).name).to.equal("Dick");
        });
        test("exceptions", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([]).maxBy()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
        });
        test("comparer", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).maxBy((x) => x, new Comparer())).to.equal(1);
            expect((await EnumerableAsync.asEnumerableAsync(persons).maxBy((x) => x.age, new Comparer())).name).to.equal("Harry");
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.maxBy()).to.equal(await e.maxBy());
        });
    });
    describe("EnumerableAsync async comparer", function () {
        test("comparer", async function () {
            class ComparerAsync<T> extends Interfaces.IAsyncCompareTo<T> {
                CompareTo(x: T, y: T): Promise<-1 | 0 | 1> {
                    return Promise.resolve(x > y ? -1 : x < y ? 1 : 0);
                }
            }
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).maxBy((x) => x, new ComparerAsync())).to.equal(1);
        });
    });
});
