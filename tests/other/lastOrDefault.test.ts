import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("lastOrDefault", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).lastOrDefault()).to.equal(3);
            expect(Enumerable.asEnumerable([]).lastOrDefault()).to.be.undefined;
            expect(Enumerable.asEnumerable([1, 2, 3]).lastOrDefault((x) => x === 5)).to.equal(0);
        });
        test("defaultValue", function () {
            const defaultValue = 1000;
            expect(Enumerable.asEnumerable<number>([]).lastOrDefault(() => true, defaultValue)).to.equal(defaultValue);
            expect(Enumerable.asEnumerable([1, 2, 3]).lastOrDefault((x) => x > 5, defaultValue)).to.equal(defaultValue);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.lastOrDefault()).to.equal(e.lastOrDefault());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).lastOrDefault()).to.equal(3);
            expect(await EnumerableAsync.asEnumerableAsync([]).lastOrDefault()).to.be.undefined;
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).lastOrDefault((x) => x === 5)).to.equal(0);
        });
        test("defaultValue", async function () {
            const defaultValue = 1000;
            expect(await EnumerableAsync.asEnumerableAsync<number>([]).lastOrDefault(() => true, defaultValue)).to.equal(defaultValue);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).lastOrDefault((x) => x > 5, defaultValue)).to.equal(defaultValue);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.lastOrDefault()).to.equal(await e.lastOrDefault());
        });
    });
    describe("EnumerableAsync async predicate", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).lastOrDefault()).to.equal(3);
            expect(await EnumerableAsync.asEnumerableAsync([]).lastOrDefault()).to.be.undefined;
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).lastOrDefault(async (x) => Promise.resolve(x === 5))).to.equal(0);
        });
        test("defaultValue", async function () {
            const defaultValue = 1000;
            expect(await EnumerableAsync.asEnumerableAsync<number>([]).lastOrDefault(() => true, defaultValue)).to.equal(defaultValue);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).lastOrDefault((x) => x > 5, defaultValue)).to.equal(defaultValue);
        });
    });
});
