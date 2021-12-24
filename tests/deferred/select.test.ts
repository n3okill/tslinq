import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("select", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(
                Enumerable.asEnumerable([1, 2, 3])
                    .select((x) => x * 2)
                    .toArray()
            ).to.be.eql([2, 4, 6]);
            expect(
                Enumerable.asEnumerable(["hello", "2", "world"])
                    .select((x) => (x === "hello" || x === "world" ? x : ""))
                    .toArray()
            ).to.be.eql(["hello", "", "world"]);
            expect(
                Enumerable.asEnumerable(["1", "2", "3"])
                    .select((num) => Number.parseInt(num, undefined))
                    .toArray()
            ).to.be.eql([1, 2, 3]);
            expect(
                Enumerable.asEnumerable([2, 1, 0])
                    .select((x, index) => index as number)
                    .toArray()
            ).to.be.eql([0, 1, 2]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]).select((x) => x * 2);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([1, 2, 3])
                    .select((x) => x * 2)
                    .toArray()
            ).to.be.eql([2, 4, 6]);
            expect(
                await EnumerableAsync.asEnumerableAsync(["hello", "2", "world"])
                    .select((x) => (x === "hello" || x === "world" ? x : ""))
                    .toArray()
            ).to.be.eql(["hello", "", "world"]);
            expect(
                await EnumerableAsync.asEnumerableAsync(["1", "2", "3"])
                    .select((num) => Number.parseInt(num, undefined))
                    .toArray()
            ).to.be.eql([1, 2, 3]);
            expect(
                await EnumerableAsync.asEnumerableAsync([2, 1, 0])
                    .select((x, index) => index as number)
                    .toArray()
            ).to.be.eql([0, 1, 2]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]).select((x) => x * 2);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
    describe("EnumerableAsync async", function () {
        test("basic", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([1, 2, 3])
                    .select(async (x) => Promise.resolve(x * 2))
                    .toArray()
            ).to.be.eql([2, 4, 6]);
            expect(
                await EnumerableAsync.asEnumerableAsync(["hello", "2", "world"])
                    .select(async (x) => Promise.resolve(x === "hello" || x === "world" ? x : ""))
                    .toArray()
            ).to.be.eql(["hello", "", "world"]);
            expect(
                await EnumerableAsync.asEnumerableAsync(["1", "2", "3"])
                    .select(async (num) => Promise.resolve(Number.parseInt(num, undefined)))
                    .toArray()
            ).to.be.eql([1, 2, 3]);
            expect(
                await EnumerableAsync.asEnumerableAsync([2, 1, 0])
                    .select(async (x, index) => Promise.resolve(index as number))
                    .toArray()
            ).to.be.eql([0, 1, 2]);
        });
    });
});
