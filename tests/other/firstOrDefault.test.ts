import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("firstOrDefault", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).firstOrDefault()).to.equal(1);
            expect(Enumerable.asEnumerable([]).firstOrDefault()).to.be.undefined;
            expect(Enumerable.asEnumerable([1, 2, 3]).firstOrDefault((x) => x === 5)).to.equal(0);
        });
        test("defaultValue", function () {
            const defaultValue = 1000;
            expect(Enumerable.asEnumerable<number>([]).firstOrDefault(() => true, defaultValue)).to.equal(defaultValue);
            expect(Enumerable.asEnumerable([1, 2, 3]).firstOrDefault((x) => x > 5, defaultValue)).to.equal(defaultValue);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.firstOrDefault()).to.equal(e.firstOrDefault());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault()).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([]).firstOrDefault()).to.be.undefined;
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault((x) => x === 5)).to.equal(0);
        });
        test("defaultValue", async function () {
            const defaultValue = 1000;
            expect(await EnumerableAsync.asEnumerableAsync<number>([]).firstOrDefault(() => true, defaultValue)).to.equal(defaultValue);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault((x) => x > 5, defaultValue)).to.equal(defaultValue);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.first()).to.equal(await e.first());
        });
    });
    describe("EnumerableAsync async predicate", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault()).to.equal(1);
            expect(await EnumerableAsync.asEnumerableAsync([]).firstOrDefault()).to.be.undefined;
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault(async (x) => Promise.resolve(x === 5))).to.equal(0);
        });
        test("defaultValue", async function () {
            const defaultValue = 1000;
            expect(await EnumerableAsync.asEnumerableAsync<number>([]).firstOrDefault(() => true, defaultValue)).to.equal(defaultValue);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).firstOrDefault((x) => x > 5, defaultValue)).to.equal(defaultValue);
        });
    });
});
