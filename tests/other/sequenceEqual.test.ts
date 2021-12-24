import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("sequenceEqual", function () {
    class Pet {
        constructor(public Name: string, public Age: number) {}
    }
    const pet1 = new Pet("Turbo", 2);
    const pet2 = new Pet("Peanut", 8);
    const pets1 = [pet1, pet2];
    const pets2 = [pet1, pet2];
    const pets3 = [pet1, pet2];
    const pets4 = [new Pet("Turbo", 2), new Pet("Peanut", 8)];
    class Comparer implements Interfaces.IEqualityComparer<Pet> {
        Equals(x: Pet, y: Pet) {
            if (x.Name === y.Name) {
                return true;
            }
            return false;
        }
    }
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable(pets1).sequenceEqual(pets2)).to.be.true;
            expect(Enumerable.asEnumerable(pets3).sequenceEqual(pets4)).to.be.false;
            expect(Enumerable.asEnumerable([pet1]).sequenceEqual([pet1, pet2])).to.be.false;
        });
        test("compare", function () {
            expect(Enumerable.asEnumerable(pets1).sequenceEqual(pets2, new Comparer())).to.be.true;
            expect(Enumerable.asEnumerable(pets3).sequenceEqual(pets4, new Comparer())).to.be.true;
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(pets1);
            expect(e.sequenceEqual(pets2)).to.equal(e.sequenceEqual(pets2));
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(pets1).sequenceEqual(pets2)).to.be.true;
            expect(await EnumerableAsync.asEnumerableAsync(pets3).sequenceEqual(pets4)).to.be.false;
            expect(await EnumerableAsync.asEnumerableAsync([pet1]).sequenceEqual([pet1, pet2])).to.be.false;
        });
        test("compare", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(pets1).sequenceEqual(pets2, new Comparer())).to.be.true;
            expect(await EnumerableAsync.asEnumerableAsync(pets3).sequenceEqual(pets4, new Comparer())).to.be.true;
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync(pets1);
            expect(await e.sequenceEqual(pets2)).to.equal(await e.sequenceEqual(pets2));
        });
    });
    describe("EnumerableAsync async comparer", function () {
        class ComparerAsync implements Interfaces.IAsyncEqualityComparer<Pet> {
            async Equals(x: Pet, y: Pet) {
                if (x.Name === y.Name) {
                    return Promise.resolve(true);
                }
                return Promise.resolve(false);
            }
        }
        test("compare", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(pets1).sequenceEqual(pets2, new ComparerAsync())).to.be.true;
            expect(await EnumerableAsync.asEnumerableAsync(pets3).sequenceEqual(pets4, new ComparerAsync())).to.be.true;
        });
    });
});
