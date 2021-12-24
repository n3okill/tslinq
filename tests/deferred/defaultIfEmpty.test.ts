import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("defaultIfEmpty", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable<number>([]).defaultIfEmpty(0).toArray()).to.be.eql([0]);
            expect(Enumerable.asEnumerable([1, 2]).defaultIfEmpty(5).toArray()).to.be.eql([1, 2]);
            expect(Enumerable.asEnumerable([]).defaultIfEmpty().toArray()).to.be.eql([undefined]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable<number>([]).defaultIfEmpty(0);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync<number>([]).defaultIfEmpty(0).toArray()).to.be.eql([0]);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2]).defaultIfEmpty(5).toArray()).to.be.eql([1, 2]);
            expect(await EnumerableAsync.asEnumerableAsync([]).defaultIfEmpty().toArray()).to.be.eql([undefined]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync<number>([]).defaultIfEmpty(0);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
