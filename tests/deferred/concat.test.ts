import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("Concat", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2]).concat([3, 4]).count()).to.equal(4);
            expect(
                Enumerable.asEnumerable(["a", "b"])
                    .concat(Enumerable.asEnumerable(["c", "d"]))
                    .count()
            ).to.equal(4);
            expect(Enumerable.asEnumerable([1, 2]).concat([3, 4]).concat([5, 6]).toArray()).to.be.eql([1, 2, 3, 4, 5, 6]);
            expect(
                Enumerable.asEnumerable(
                    new Map([
                        ["a", 1],
                        ["b", 2],
                    ])
                )
                    .concat(new Map([["c", 3]]))
                    .count()
            ).to.equal(3);
        });
        test("handles two empty arrays", function () {
            expect(Enumerable.asEnumerable([]).concat([]).toArray()).to.be.eql([]);
        });
        test("handles calling array being empty", function () {
            expect(Enumerable.asEnumerable<number>([]).concat([1]).toArray()).to.be.eql([1]);
        });
        test("handles concat with empty array", function () {
            expect(Enumerable.asEnumerable([2]).concat([]).toArray()).to.be.eql([2]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2]).concat([3]);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2]).concat([3, 4]).count()).to.equal(4);
            expect(
                await EnumerableAsync.asEnumerableAsync(["a", "b"])
                    .concat(EnumerableAsync.asEnumerableAsync(["c", "d"]))
                    .count()
            ).to.equal(4);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2]).concat([3, 4]).concat([5, 6]).toArray()).to.be.eql([1, 2, 3, 4, 5, 6]);
            expect(
                await EnumerableAsync.asEnumerableAsync(
                    new Map([
                        ["a", 1],
                        ["b", 2],
                    ])
                )
                    .concat(new Map([["c", 3]]))
                    .count()
            ).to.equal(3);
        });
        test("handles two empty arrays", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([]).concat([]).toArray()).to.be.eql([]);
        });
        test("handles calling array being empty", async function () {
            expect(await EnumerableAsync.asEnumerableAsync<number>([]).concat([1]).toArray()).to.be.eql([1]);
        });
        test("handles concat with empty array", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([2]).concat([]).toArray()).to.be.eql([2]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2]).concat([3]);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
