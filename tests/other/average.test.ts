import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("Average", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).average()).to.equal(2);
            expect(Enumerable.asEnumerable(["a", "bc", "def"]).average((x: string) => x.length)).to.equal(2);
            expect(Enumerable.asEnumerable([0, 10]).average()).to.equal(5);
        });
        test("EmptyThrowsException", function () {
            expect(() => Enumerable.asEnumerable([]).average()).to.throw(Exceptions.ThrowNoElementsException);
            expect(() => Enumerable.asEnumerable([] as number[]).average((x) => x * 10)).to.throw(Exceptions.ThrowNoElementsException);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.average()).to.equal(e.average());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).average()).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync(["a", "bc", "def"]).average((x: string) => x.length)).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync([0, 10]).average()).to.equal(5);
        });
        test("EmptyThrowsException", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([]).average()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
            await expect(EnumerableAsync.asEnumerableAsync([] as number[]).average((x) => x * 10)).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.average()).to.equal(await e.average());
        });
    });
    describe("EnumerableAsync async selector", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).average()).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync(["a", "bc", "def"]).average(async (x: string) => Promise.resolve(x.length))).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync([0, 10]).average()).to.equal(5);
        });
        test("EmptyThrowsException", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([]).average()).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
            await expect(EnumerableAsync.asEnumerableAsync([] as number[]).average(async (x) => Promise.resolve(x * 10))).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.average()).to.equal(await e.average());
        });
    });
});
