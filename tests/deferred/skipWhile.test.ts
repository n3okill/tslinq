import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("skipWhile", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(
                Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
                    .orderByDescending((grade) => grade)
                    .skipWhile((grade) => grade >= 80)
                    .toArray()
            ).to.be.eql([70, 59, 56]);

            expect(
                Enumerable.asEnumerable([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500])
                    .skipWhile((amount, index) => amount > index * 1000)
                    .toArray()
            ).to.be.eql([4000, 1500, 5500]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([59, 82, 70, 56, 92, 98, 85])
                .orderByDescending((grade) => grade)
                .skipWhile((grade) => grade >= 80);

            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
                    .orderByDescending((grade) => grade)
                    .skipWhile((grade) => grade >= 80)
                    .toArray()
            ).to.be.eql([70, 59, 56]);

            expect(
                await EnumerableAsync.asEnumerableAsync([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500])
                    .skipWhile((amount, index) => amount > index * 1000)
                    .toArray()
            ).to.be.eql([4000, 1500, 5500]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
                .orderByDescending((grade) => grade)
                .skipWhile((grade) => grade >= 80);

            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
    describe("EnumerableAsync async", function () {
        test("basic", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([59, 82, 70, 56, 92, 98, 85])
                    .orderByDescending(async (grade) => Promise.resolve(grade))
                    .skipWhile(async (grade) => Promise.resolve(grade >= 80))
                    .toArray()
            ).to.be.eql([70, 59, 56]);

            expect(
                await EnumerableAsync.asEnumerableAsync([5000, 2500, 9000, 8000, 6500, 4000, 1500, 5500])
                    .skipWhile(async (amount, index) => Promise.resolve(amount > index * 1000))
                    .toArray()
            ).to.be.eql([4000, 1500, 5500]);
        });
    });
});
