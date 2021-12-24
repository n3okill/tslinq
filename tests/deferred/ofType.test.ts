import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("ofType", function () {
    const array = ["str", "str2", 1, 2, 3, {}, true, new Number(1)];
    describe("Enumerable", function () {
        test("basic", function () {
            const e = Enumerable.asEnumerable(array);
            expect(e.ofType("string").toArray()).to.be.eql(["str", "str2"]);
            expect(e.ofType("number").toArray()).to.be.eql([1, 2, 3]);
            expect(e.ofType("object").toArray()).to.be.eql([{}, new Number(1)]);
            expect(e.ofType("boolean").toArray()).to.be.eql([true]);
            expect(e.ofType(Number).toArray()).to.be.eql([new Number(1)]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(array).ofType("string");
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync(array);
            expect(await e.ofType("string").toArray()).to.be.eql(["str", "str2"]);
            expect(await e.ofType("number").toArray()).to.be.eql([1, 2, 3]);
            expect(await e.ofType("object").toArray()).to.be.eql([{}, new Number(1)]);
            expect(await e.ofType("boolean").toArray()).to.be.eql([true]);
            expect(await e.ofType(Number).toArray()).to.be.eql([new Number(1)]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync(array).ofType("string");
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
