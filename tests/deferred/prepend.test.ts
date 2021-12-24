import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("prepend", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            const c = Enumerable.asEnumerable([1, 2]);
            expect(c.count()).to.equal(2);
            expect(c.prepend(3).count()).to.equal(3);
            const e = c.prepend(4);
            expect(e.count()).to.equal(3);
            expect(e.toArray()).to.be.eql([4, 1, 2]);
        });
        test("repeated calls", function () {
            const c = Enumerable.asEnumerable([1, 2]).prepend(3);
            expect(c.toArray()).to.be.eql(c.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            const c = EnumerableAsync.asEnumerableAsync([1, 2]);
            expect(await c.count()).to.equal(2);
            expect(await c.prepend(3).count()).to.equal(3);
            const e = c.prepend(4);
            expect(await e.count()).to.equal(3);
            expect(await e.toArray()).to.be.eql([4, 1, 2]);
        });
        test("repeated calls", async function () {
            const c = EnumerableAsync.asEnumerableAsync([1, 2]).prepend(3);
            expect(await c.toArray()).to.be.eql(await c.toArray());
        });
    });
});
