import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("first", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).first()).to.equal(1);
            expect(Enumerable.asEnumerable([1, 2, 3]).except([1]).first()).to.equal(2);
            expect(Enumerable.asEnumerable([1, 2, 3]).first((x) => x === 2)).to.equal(2);
        });
        test("exceptions", function () {
            expect(() => Enumerable.asEnumerable([]).first()).to.throw(Exceptions.ThrowNoElementsException);
            expect(() => Enumerable.asEnumerable([1, 2, 3]).first((x) => x === 4)).to.throw(Exceptions.ThrowNoElementsSatisfyCondition);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.first()).to.equal(e.first());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).first()).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).except([1]).first()).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).first((x) => x === 2)).to.equal(2);
        });
        test("exceptions", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([]).first()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
            await expect(EnumerableAsync.asEnumerableAsync([1, 2, 3]).first((x) => x === 4)).to.eventually.rejectedWith(Exceptions.ThrowNoElementsSatisfyCondition);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.first()).to.equal(await e.first());
        });
    });
    describe("EnumerableAsync async predicate", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).first()).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).except([1]).first()).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).first(async (x) => Promise.resolve(x === 2))).to.equal(2);
        });
        test("exceptions", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([]).first()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
            await expect(EnumerableAsync.asEnumerableAsync([1, 2, 3]).first(async (x) => Promise.resolve(x === 4))).to.eventually.rejectedWith(Exceptions.ThrowNoElementsSatisfyCondition);
        });
    });
});
