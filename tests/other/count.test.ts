import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("Count", function () {
    describe("Enumerable", function () {
        test("simple", function () {
            expect(Enumerable.asEnumerable([0]).count()).to.equal(1);
            expect(Enumerable.asEnumerable([0, 1, 2]).count()).to.equal(3);
        });
        test("predicate", function () {
            expect(Enumerable.asEnumerable([0, 1, 2]).count((x: number) => x === 1)).to.equal(1);
            expect(Enumerable.asEnumerable([true, true, false]).count((x) => x)).to.equal(2);
            expect(Enumerable.asEnumerable([true, true, false]).count((x) => !x)).to.equal(1);
        });
        test("Empty array to be zero", function () {
            expect(Enumerable.asEnumerable([]).count()).to.equal(0);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([0]);
            expect(e.count()).to.equal(e.count());
        });
    });
    describe("EnumerableAsync", function () {
        test("simple", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([0]).count()).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([0, 1, 2]).count()).to.equal(3);
        });
        test("predicate", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([0, 1, 2]).count((x: number) => x === 1)).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([true, true, false]).count((x) => x)).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync([true, true, false]).count((x) => !x)).to.equal(1);
        });
        test("Empty array to be zero", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([]).count()).to.equal(0);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([0]);
            expect(await e.count()).to.equal(await e.count());
        });
    });
    describe("EnumerableAsync async predicate", function () {
        test("simple", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([0]).count()).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([0, 1, 2]).count()).to.equal(3);
        });
        test("predicate", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([0, 1, 2]).count(async (x: number) => Promise.resolve(x === 1))).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([true, true, false]).count(async (x) => Promise.resolve(x))).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync([true, true, false]).count(async (x) => Promise.resolve(!x))).to.equal(1);
        });
        test("Empty array to be zero", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([]).count()).to.equal(0);
        });
    });
});
