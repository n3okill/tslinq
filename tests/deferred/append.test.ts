import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("append", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            const c = Enumerable.asEnumerable([1, 2]);
            expect(c.count()).to.equal(2);
            expect(c.append(3).count()).to.equal(3);
            const e = c.append(4);
            expect(e.count()).to.equal(3);
            expect(e.toArray()).to.be.eql([1, 2, 4]);
            expect(Enumerable.asEnumerable("Hell").append("o").toArray()).to.be.eql(["H", "e", "l", "l", "o"]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2]).append(3);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            const c = EnumerableAsync.asEnumerableAsync([1, 2]);
            expect(await c.count()).to.equal(2);
            expect(await c.append(3).count()).to.equal(3);
            const e = c.append(4);
            expect(await e.count()).to.equal(3);
            expect(await e.toArray()).to.be.eql([1, 2, 4]);
            expect(await EnumerableAsync.asEnumerableAsync("Hell").append("o").toArray()).to.be.eql(["H", "e", "l", "l", "o"]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2]).append(3);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
