import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("repeat", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.repeat("a", 3).toArray()).to.be.eql(["a", "a", "a"]);
            expect(Enumerable.repeat(1, 5).toArray()).to.be.eql([1, 1, 1, 1, 1]);
        });
        test("repeated calls", function () {
            const e = Enumerable.repeat(1, 5);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.repeat("a", 3).toArray()).to.be.eql(["a", "a", "a"]);
            expect(await EnumerableAsync.repeat(1, 5).toArray()).to.be.eql([1, 1, 1, 1, 1]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.range(1, 5);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
