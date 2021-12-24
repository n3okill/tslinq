import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("take", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(
                Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
                    .orderByDescending((grade) => grade)
                    .take(3)
                    .toArray()
            ).to.be.eql([98, 92, 85]);
            expect(Enumerable.asEnumerable([]).take(3).toArray()).to.be.eql([]);
            expect(
                Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
                    .orderByDescending((grade) => grade)
                    .take(-3)
                    .toArray()
            ).to.be.eql([]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
                .orderByDescending((grade) => grade)
                .take(3);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
                    .orderByDescending((grade) => grade)
                    .take(3)
                    .toArray()
            ).to.be.eql([98, 92, 85]);
            expect(await EnumerableAsync.asEnumerableAsync([]).take(3).toArray()).to.be.eql([]);
            expect(
                await EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
                    .orderByDescending((grade) => grade)
                    .take(-3)
                    .toArray()
            ).to.be.eql([]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
                .orderByDescending((grade) => grade)
                .take(3);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
});
