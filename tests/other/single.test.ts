import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("single", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1]).single()).to.equal(1);
            expect(Enumerable.asEnumerable([1, 2, 3]).single((x) => x === 2)).to.equal(2);
        });
        test("exceptions", function () {
            expect(() => Enumerable.asEnumerable([1, 2]).single()).to.throw();
            expect(() => Enumerable.asEnumerable([]).single()).to.throw();
            expect(() => Enumerable.asEnumerable([1, 2]).single((x) => x === 3)).to.throw();
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1]);
            expect(e.single()).to.equal(e.single());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1]).single()).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).single((x) => x === 2)).to.equal(2);
        });
        test("exceptions", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([1, 2]).single()).to.eventually.rejectedWith(Exceptions.ThrowMoreThanOneElementSatisfiesCondition);
            await expect(EnumerableAsync.asEnumerableAsync([]).single()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
            await expect(EnumerableAsync.asEnumerableAsync([1, 2]).single((x) => x === 3)).to.eventually.rejectedWith(Exceptions.ThrowNoElementsSatisfyCondition);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1]);
            expect(await e.single()).to.equal(await e.single());
        });
    });
    describe("EnumerableAsync async predicate", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1]).single()).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).single(async (x) => Promise.resolve(x === 2))).to.equal(2);
        });
        test("exceptions", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([1, 2]).single()).to.eventually.rejectedWith(Exceptions.ThrowMoreThanOneElementSatisfiesCondition);
            await expect(EnumerableAsync.asEnumerableAsync([]).single()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
            await expect(EnumerableAsync.asEnumerableAsync([1, 2]).single(async (x) => Promise.resolve(x === 3))).to.eventually.rejectedWith(Exceptions.ThrowNoElementsSatisfyCondition);
        });
    });
});
