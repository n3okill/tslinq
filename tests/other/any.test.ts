import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("Any", function () {
    const evenArray = [0, 2, 4, 6, 8, 10];
    describe("Enumerable", function () {
        test("No predicate", function () {
            expect(Enumerable.asEnumerable(evenArray).any()).to.be.true;
        });
        test("True", function () {
            expect(Enumerable.asEnumerable(evenArray).any((x: number) => x > 5)).to.be.true;
        });
        test("False", function () {
            expect(Enumerable.asEnumerable(evenArray).any((x: number) => x > 10)).to.be.false;
        });
        test("repeated calls", function () {
            const c = Enumerable.asEnumerable(evenArray);
            expect(c.any((x: number) => x % 2 !== 0)).to.equal(c.any((x: number) => x % 2 !== 0));
        });
        test("Empty", function () {
            const array = Enumerable.asEnumerable([]);

            expect(array.any()).to.be.false;
            expect(array.any(() => true)).to.be.false;
            expect(array.any(() => false)).to.be.false;
        });
        test("AnyExists", function () {
            const array = Enumerable.asEnumerable([1, 2]);

            expect(array.any()).to.be.true;
            expect(array.any(() => true)).to.be.true;
            expect(array.any(() => false)).to.be.false;

            expect(array.any((x) => x === 1)).to.be.true;
            expect(array.any((x) => x === 2)).to.be.true;
        });
        test("EmptyPredicate", function () {
            expect(Enumerable.asEnumerable([]).any((x) => x === 0)).to.be.false;
        });
    });
    describe("EnumerableAsync", function () {
        test("No predicate", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(evenArray).any()).to.be.true;
        });
        test("True", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(evenArray).any((x: number) => x > 5)).to.be.true;
        });
        test("False", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(evenArray).any((x: number) => x > 10)).to.be.false;
        });
        test("repeated calls", async function () {
            const c = EnumerableAsync.asEnumerableAsync(evenArray);
            expect(await c.any((x: number) => x % 2 !== 0)).to.equal(await c.any((x: number) => x % 2 !== 0));
        });
        test("Empty", async function () {
            const a = EnumerableAsync.asEnumerableAsync([]);

            expect(await a.any()).to.be.false;
            expect(await a.any(() => true)).to.be.false;
            expect(await a.any(() => false)).to.be.false;
        });
        test("AnyExists", async function () {
            const a = EnumerableAsync.asEnumerableAsync([1, 2]);

            expect(await a.any()).to.be.true;
            expect(await a.any(() => true)).to.be.true;
            expect(await a.any(() => false)).to.be.false;

            expect(await a.any((x) => x === 1)).to.be.true;
            expect(await a.any((x) => x === 2)).to.be.true;
        });
        test("EmptyPredicate", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([]).any((x) => x === 0)).to.be.false;
        });
    });
    describe("EnumerableAsync async predicate", function () {
        test("No predicate", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(evenArray).any()).to.be.true;
        });
        test("True", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(evenArray).any(async (x: number) => Promise.resolve(x > 5))).to.be.true;
        });
        test("False", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(evenArray).any(async (x: number) => Promise.resolve(x > 10))).to.be.false;
        });
        test("repeated calls", async function () {
            const c = EnumerableAsync.asEnumerableAsync(evenArray);
            expect(await c.any((x: number) => x % 2 !== 0)).to.equal(await c.any(async (x: number) => Promise.resolve(x % 2 !== 0)));
        });
        test("Empty", async function () {
            const a = EnumerableAsync.asEnumerableAsync([]);

            expect(await a.any()).to.be.false;
            expect(await a.any(async () => Promise.resolve(true))).to.be.false;
            expect(await a.any(async () => Promise.resolve(false))).to.be.false;
        });
        test("AnyExists", async function () {
            const a = EnumerableAsync.asEnumerableAsync([1, 2]);

            expect(await a.any()).to.be.true;
            expect(await a.any(async () => Promise.resolve(true))).to.be.true;
            expect(await a.any(async () => Promise.resolve(false))).to.be.false;

            expect(await a.any(async (x) => Promise.resolve(x === 1))).to.be.true;
            expect(await a.any(async (x) => Promise.resolve(x === 2))).to.be.true;
        });
        test("EmptyPredicate", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([]).any(async (x) => Promise.resolve(x === 0))).to.be.false;
        });
    });
});
