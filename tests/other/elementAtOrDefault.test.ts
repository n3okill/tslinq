import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("elementAtOrDefault", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).elementAtOrDefault(10)).to.equal(0);
            expect(Enumerable.asEnumerable(["a", "b", "c"]).elementAtOrDefault(5)).to.equal("");
            expect(Enumerable.asEnumerable([1, 2, 3]).elementAtOrDefault(1)).to.equal(2);
            expect(Enumerable.asEnumerable(["a", "b", "c"]).elementAtOrDefault(2)).to.equal("c");
            expect(Enumerable.asEnumerable([]).elementAtOrDefault(0)).to.be.undefined;
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.elementAtOrDefault(1)).to.equal(e.elementAtOrDefault(1));
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).elementAtOrDefault(10)).to.equal(0);
            expect(await EnumerableAsync.asEnumerableAsync(["a", "b", "c"]).elementAtOrDefault(5)).to.equal("");
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).elementAtOrDefault(1)).to.equal(2);
            expect(await EnumerableAsync.asEnumerableAsync(["a", "b", "c"]).elementAtOrDefault(2)).to.equal("c");
            expect(await EnumerableAsync.asEnumerableAsync([]).elementAtOrDefault(0)).to.be.undefined;
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.elementAtOrDefault(1)).to.equal(await e.elementAtOrDefault(1));
        });
    });
});
