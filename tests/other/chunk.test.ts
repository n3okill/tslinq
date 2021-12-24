import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("chunk", function () {
    const testArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable(testArray).chunk(3).toArray()).to.be.eql([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
            ]);
        });
        test("Append before iterating", function () {
            const a = Enumerable.asEnumerable(testArray).append(10);
            expect(a.chunk(3).toArray()).to.be.eql([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
        });
        test("Except before iterating", function () {
            const a = Enumerable.asEnumerable(testArray).except([3, 6, 9]);
            expect(a.chunk(3).toArray()).to.be.eql([
                [1, 2, 4],
                [5, 7, 8],
            ]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(testArray);
            expect(e.chunk(3).toArray()).to.be.eql(e.chunk(3).toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(testArray).chunk(3).toArray()).to.be.eql([
                [1, 2, 3],
                [4, 5, 6],
                [7, 8, 9],
            ]);
        });
        test("Append before iterating", async function () {
            const a = EnumerableAsync.asEnumerableAsync(testArray).append(10);
            expect(await a.chunk(3).toArray()).to.be.eql([[1, 2, 3], [4, 5, 6], [7, 8, 9], [10]]);
        });
        test("Except before iterating", async function () {
            const a = EnumerableAsync.asEnumerableAsync(testArray).except([3, 6, 9]);
            expect(await a.chunk(3).toArray()).to.be.eql([
                [1, 2, 4],
                [5, 7, 8],
            ]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync(testArray);
            expect(await e.chunk(3).toArray()).to.be.eql(await e.chunk(3).toArray());
        });
    });
});
