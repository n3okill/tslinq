import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

const evenArray = [0, 2, 4, 6, 8, 10];

describe("All", function () {
    describe("Enumerable", function () {
        test("isEven false", function () {
            expect(Enumerable.asEnumerable([9999, 0, 888, -1, 66, -777, 1, 2, -12345]).all((x: number) => x % 2 === 0)).to.be.false;
        });
        test("isEven true", function () {
            expect(Enumerable.asEnumerable(evenArray).all((x: number) => x % 2 === 0)).to.be.true;
        });
        test("repeated calls", function () {
            const c = Enumerable.asEnumerable(evenArray);
            expect(c.all((x: number) => x % 2 === 0)).to.equal(c.all((x: number) => x % 2 === 0));
        });
        test("String", function () {
            expect(Enumerable.asEnumerable("aaaa").all((x) => x === "a")).to.equal(true);
            expect(Enumerable.asEnumerable("aaab").all((x) => x === "a")).to.equal(false);
        });
        test("EmptyString", function () {
            expect(Enumerable.asEnumerable("").all((x) => x === "a")).to.equal(true);
        });
        test("Basic", function () {
            // Create an array of Pets.
            const pets = Enumerable.asEnumerable([
                { Age: 10, Name: "Barley" },
                { Age: 4, Name: "Boots" },
                { Age: 6, Name: "Whiskers" },
            ]);

            // Determine whether all pet names
            // in the array start with 'B'.
            const allStartWithB = pets.all((pet) => pet.Name.startsWith("B"));

            expect(allStartWithB).to.equal(false);
        });
    });

    describe("EnumerableAsync", function () {
        test("isEven false", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([9999, 0, 888, -1, 66, -777, 1, 2, -12345]).all((x: number) => x % 2 === 0)).to.be.false;
        });
        test("isEven true", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(evenArray).all((x: number) => x % 2 === 0)).to.be.true;
        });
        test("repeated calls", async function () {
            const c = EnumerableAsync.asEnumerableAsync(evenArray);
            expect(await c.all((x: number) => x % 2 === 0)).to.equal(await c.all((x: number) => x % 2 === 0));
        });
        test("Basic", async function () {
            // Create an array of Pets.
            const pets = EnumerableAsync.asEnumerableAsync([
                { Age: 10, Name: "Barley" },
                { Age: 4, Name: "Boots" },
                { Age: 6, Name: "Whiskers" },
            ]);

            // Determine whether all pet names
            // in the array start with 'B'.
            const allStartWithB = await pets.all((pet) => pet.Name.startsWith("B"));

            expect(allStartWithB).to.equal(false);
        });
    });
    describe("EnumerableAsync async predicate", function () {
        test("isEven false", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([9999, 0, 888, -1, 66, -777, 1, 2, -12345]).all(async (x: number) => Promise.resolve(x % 2 === 0))).to.be.false;
        });
        test("isEven true", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(evenArray).all(async (x: number) => Promise.resolve(x % 2 === 0))).to.be.true;
        });
        test("repeated calls", async function () {
            const c = EnumerableAsync.asEnumerableAsync(evenArray);
            expect(await c.all(async (x: number) => Promise.resolve(x % 2 === 0))).to.equal(await c.all((x: number) => x % 2 === 0));
        });
        test("Basic", async function () {
            // Create an array of Pets.
            const pets = EnumerableAsync.asEnumerableAsync([
                { Age: 10, Name: "Barley" },
                { Age: 4, Name: "Boots" },
                { Age: 6, Name: "Whiskers" },
            ]);

            // Determine whether all pet names
            // in the array start with 'B'.
            const allStartWithB = await pets.all(async (pet) => Promise.resolve(pet.Name.startsWith("B")));

            expect(allStartWithB).to.equal(false);
        });
    });
});
