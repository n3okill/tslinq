import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("singleOrDefault", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1]).singleOrDefault()).to.equal(1);
            expect(Enumerable.asEnumerable([1, 2, 3]).singleOrDefault((x) => x === 2)).to.equal(2);
            expect(Enumerable.asEnumerable([1, 2]).singleOrDefault((x) => x === 3)).to.equal(0);
            expect(Enumerable.asEnumerable([]).singleOrDefault()).to.be.undefined;
        });
        test("exception", function () {
            expect(() => Enumerable.asEnumerable([1, 2]).singleOrDefault()).to.throw(Exceptions.ThrowMoreThanOneElementSatisfiesCondition.message);
        });
        test("defaultValue", function () {
            const defaultValue = 1000;
            expect(Enumerable.asEnumerable<number>([]).singleOrDefault(() => true, defaultValue)).to.equal(defaultValue);
            expect(Enumerable.asEnumerable([1, 2, 3]).singleOrDefault((x) => x > 5, defaultValue)).to.equal(defaultValue);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1]);
            expect(e.singleOrDefault()).to.equal(e.singleOrDefault());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1]).singleOrDefault()).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).singleOrDefault((x) => x === 2)).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2]).singleOrDefault((x) => x === 3)).to.equal(0);
            expect(await EnumerableAsync.asEnumerableAsync([]).singleOrDefault()).to.be.undefined;
        });
        test("exception", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([1, 2]).singleOrDefault()).to.eventually.rejectedWith(Exceptions.ThrowMoreThanOneElementSatisfiesCondition.message);
        });
        test("defaultValue", async function () {
            const defaultValue = 1000;
            expect(await EnumerableAsync.asEnumerableAsync<number>([]).singleOrDefault(() => true, defaultValue)).to.equal(defaultValue);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).singleOrDefault((x) => x > 5, defaultValue)).to.equal(defaultValue);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1]);
            expect(await e.singleOrDefault()).to.equal(await e.singleOrDefault());
        });
    });
    describe("EnumerableAsync async predicate", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1]).singleOrDefault()).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).singleOrDefault(async (x) => Promise.resolve(x === 2))).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2]).singleOrDefault(async (x) => Promise.resolve(x === 3))).to.equal(0);
            expect(await EnumerableAsync.asEnumerableAsync([]).singleOrDefault()).to.be.undefined;
        });
        test("exception", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([1, 2]).singleOrDefault()).to.eventually.rejectedWith(Exceptions.ThrowMoreThanOneElementSatisfiesCondition.message);
        });
        test("defaultValue", async function () {
            const defaultValue = 1000;
            expect(await EnumerableAsync.asEnumerableAsync<number>([]).singleOrDefault(() => true, defaultValue)).to.equal(defaultValue);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).singleOrDefault((x) => x > 5, defaultValue)).to.equal(defaultValue);
        });
    });
});
