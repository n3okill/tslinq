import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("last", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).last()).to.equal(3);
            expect(Enumerable.asEnumerable([1, 2, 3]).except([3]).last()).to.equal(2);
            expect(Enumerable.asEnumerable([1, 2, 3]).last((x) => x === 2)).to.equal(2);
        });
        test("exception", function () {
            expect(() => Enumerable.asEnumerable([]).last()).to.throw(Exceptions.ThrowNoElementsException);
            expect(() => Enumerable.asEnumerable([]).last((x) => x > 2)).to.throw(Exceptions.ThrowNoElementsException);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.last()).to.equal(e.last());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).last()).to.equal(3);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).except([3]).last()).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).last((x) => x === 2)).to.equal(2);
        });
        test("exception", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([]).last()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
            await expect(EnumerableAsync.asEnumerableAsync([]).last((x) => x > 2)).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.last()).to.equal(await e.last());
        });
    });
    describe("EnumerableAsync async predicate", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).last()).to.equal(3);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).except([3]).last()).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).last(async (x) => Promise.resolve(x === 2))).to.equal(2);
        });
        test("exception", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([]).last()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
            await expect(EnumerableAsync.asEnumerableAsync([]).last(async (x) => Promise.resolve(x > 2))).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
        });
    });
});
