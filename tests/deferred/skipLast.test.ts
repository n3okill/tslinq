import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("skipLast", function () {
    const arr = [1, 2, 3, 4, 5];
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable(arr).skipLast(3).toArray()).to.be.eql([1, 2]);
            expect(Enumerable.asEnumerable(arr).skipLast(0).toArray()).to.be.eql(arr);
            expect(Enumerable.asEnumerable(arr).skipLast(-5).toArray()).to.be.eql(arr);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(arr).skipLast(3);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(arr).skipLast(3).toArray()).to.be.eql([1, 2]);
            expect(await EnumerableAsync.asEnumerableAsync(arr).skipLast(0).toArray()).to.be.eql(arr);
            expect(await EnumerableAsync.asEnumerableAsync(arr).skipLast(-5).toArray()).to.be.eql(arr);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync(arr).skipLast(3);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
