import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("range", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(
                Enumerable.range(1, 5)
                    .select((x) => (x as number) * 2)
                    .toArray()
            ).to.be.eql([2, 4, 6, 8, 10]);
            expect(Enumerable.range("a", 3).toArray()).to.be.eql(["a", "b", "c"]);
        });
        test("repeated calls", function () {
            const e = Enumerable.range(1, 5);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(
                await EnumerableAsync.range(1, 5)
                    .select((x) => (x as number) * 2)
                    .toArray()
            ).to.be.eql([2, 4, 6, 8, 10]);
            expect(await EnumerableAsync.range("a", 3).toArray()).to.be.eql(["a", "b", "c"]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.range(1, 5);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
