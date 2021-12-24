import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("asEnumerable", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            const e = Enumerable.asEnumerable([1, 2]);
            expect(e).to.be.instanceOf(Enumerable);
            expect(e.toArray()).to.be.eql([1, 2]);
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2]);
            expect(e).to.be.instanceOf(EnumerableAsync);
            expect(await e.toArray()).to.be.eql([1, 2]);
        });
    });
});
