import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("takeLast", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(
                Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
                    .orderByDescending((grade) => grade)
                    .takeLast(3)
                    .toArray()
            ).to.be.eql([70, 59, 56]);
            expect(Enumerable.asEnumerable([]).takeLast(3).toArray()).to.be.eql([]);
            expect(
                Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
                    .orderByDescending((grade) => grade)
                    .takeLast(-3)
                    .toArray()
            ).to.be.eql([]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
                .orderByDescending((grade) => grade)
                .takeLast(3);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
                    .orderByDescending((grade) => grade)
                    .takeLast(3)
                    .toArray()
            ).to.be.eql([70, 59, 56]);
            expect(await EnumerableAsync.asEnumerableAsync([]).takeLast(3).toArray()).to.be.eql([]);
            expect(
                await EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
                    .orderByDescending((grade) => grade)
                    .takeLast(-3)
                    .toArray()
            ).to.be.eql([]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
                .orderByDescending((grade) => grade)
                .takeLast(3);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
