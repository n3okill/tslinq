import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("toArray", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            const result = e.toArray();
            expect(result).to.be.eql([1, 2, 3]);
            expect(result).to.have.length(e.count());
            expect(e.toArray()).to.be.eql(result);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            const result = await e.toArray();
            expect(result).to.be.eql([1, 2, 3]);
            expect(result).to.have.length(await e.count());
            expect(await e.toArray()).to.be.eql(result);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
