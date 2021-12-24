import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("unionBy", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).unionBy([3, 4, 5]).toArray()).to.be.eql([1, 2, 3, 4, 5]);
            expect(Enumerable.asEnumerable([1, 3, 5]).unionBy([2, 4, 6]).unionBy([1, 2, 3, 7]).unionBy([4, 5, 6, 8]).toArray()).to.be.eql([1, 3, 5, 2, 4, 6, 7, 8]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]).unionBy([3, 4, 5]);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).unionBy([3, 4, 5]).toArray()).to.be.eql([1, 2, 3, 4, 5]);
            expect(await EnumerableAsync.asEnumerableAsync([1, 3, 5]).unionBy([2, 4, 6]).unionBy([1, 2, 3, 7]).unionBy([4, 5, 6, 8]).toArray()).to.be.eql([1, 3, 5, 2, 4, 6, 7, 8]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]).unionBy([3, 4, 5]);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
