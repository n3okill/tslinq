import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("reverse", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).reverse().toArray()).to.be.eql([3, 2, 1]);
            expect(Enumerable.asEnumerable([]).reverse().toArray()).to.be.eql([]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]).reverse();
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).reverse().toArray()).to.be.eql([3, 2, 1]);
            expect(await EnumerableAsync.asEnumerableAsync([]).reverse().toArray()).to.be.eql([]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]).reverse();
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
