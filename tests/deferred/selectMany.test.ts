import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("selectMany", function () {
    class PetOwner {
        constructor(public Name: string, public Pets: Array<string>) {}
    }

    const petOwners = [new PetOwner("Higa", ["Scruffy", "Sam"]), new PetOwner("Ashkenazi", ["Walker", "Sugar"]), new PetOwner("Price", ["Scratches", "Diesel"]), new PetOwner("Hines", ["Dusty"])];
    const result = [
        { Owner: "Higa", Pet: "Scruffy" },
        { Owner: "Higa", Pet: "Sam" },
        { Owner: "Ashkenazi", Pet: "Sugar" },
        { Owner: "Price", Pet: "Scratches" },
    ];
    const resultSelectMany = ["Scruffy", "Sam", "Walker", "Sugar", "Scratches", "Diesel", "Dusty"];
    const resultSelect = [["Scruffy", "Sam"], ["Walker", "Sugar"], ["Scratches", "Diesel"], ["Dusty"]];

    describe("Enumerable", function () {
        test("basic", function () {
            const e = Enumerable.asEnumerable(petOwners)
                .selectMany(
                    (petOwner) => petOwner.Pets,
                    (petOwner, petName) => {
                        return { Owner: petOwner, Pet: petName };
                    }
                )
                .where((ownerAndPet) => ownerAndPet.Pet.startsWith("S"))
                .select((ownerAndPet) => {
                    return { Owner: ownerAndPet.Owner.Name, Pet: ownerAndPet.Pet };
                });
            expect(e.toArray()).to.be.eql(result);
        });
        test("Select", function () {
            const selectMany = Enumerable.asEnumerable(petOwners).selectMany((petOwner) => petOwner.Pets);
            const select = Enumerable.asEnumerable(petOwners).select((petOwner) => petOwner.Pets);
            expect(selectMany.toArray()).to.have.length(7);
            expect(select.toArray()).to.have.length(4);
            expect(selectMany.toArray()).to.be.eql(resultSelectMany);
            expect(select.toArray()).to.be.eql(resultSelect);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(petOwners)
                .selectMany(
                    (petOwner) => petOwner.Pets,
                    (petOwner, petName) => {
                        return { Owner: petOwner, Pet: petName };
                    }
                )
                .where((ownerAndPet) => ownerAndPet.Pet.startsWith("S"))
                .select((ownerAndPet) => {
                    return { Owner: ownerAndPet.Owner.Name, Pet: ownerAndPet.Pet };
                });
            expect(e.toArray()).to.be.eql(e.toArray());
            expect(e.toArray()).to.be.eql(result);
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync(petOwners)
                .selectMany(
                    (petOwner) => petOwner.Pets,
                    (petOwner, petName) => {
                        return { Owner: petOwner, Pet: petName };
                    }
                )
                .where((ownerAndPet) => ownerAndPet.Pet.startsWith("S"))
                .select((ownerAndPet) => {
                    return { Owner: ownerAndPet.Owner.Name, Pet: ownerAndPet.Pet };
                });
            expect(await e.toArray()).to.be.eql(result);
        });
        test("Select", async function () {
            const selectMany = EnumerableAsync.asEnumerableAsync(petOwners).selectMany((petOwner) => petOwner.Pets);
            const select = EnumerableAsync.asEnumerableAsync(petOwners).select((petOwner) => petOwner.Pets);
            expect(await selectMany.toArray()).to.have.length(7);
            expect(await select.toArray()).to.have.length(4);
            expect(await selectMany.toArray()).to.be.eql(resultSelectMany);
            expect(await select.toArray()).to.be.eql(resultSelect);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync(petOwners)
                .selectMany(
                    (petOwner) => petOwner.Pets,
                    (petOwner, petName) => {
                        return { Owner: petOwner, Pet: petName };
                    }
                )
                .where((ownerAndPet) => ownerAndPet.Pet.startsWith("S"))
                .select((ownerAndPet) => {
                    return { Owner: ownerAndPet.Owner.Name, Pet: ownerAndPet.Pet };
                });
            expect(await e.toArray()).to.be.eql(await e.toArray());
            expect(await e.toArray()).to.be.eql(result);
        });
    });
    describe("EnumerableAsync async", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync(petOwners)
                .selectMany(
                    async (petOwner) => Promise.resolve(petOwner.Pets),
                    async (petOwner, petName) => Promise.resolve({ Owner: petOwner, Pet: petName })
                )
                .where(async (ownerAndPet) => Promise.resolve(ownerAndPet.Pet.startsWith("S")))
                .select(async (ownerAndPet) => Promise.resolve({ Owner: ownerAndPet.Owner.Name, Pet: ownerAndPet.Pet }));
            expect(await e.toArray()).to.be.eql(result);
        });
        test("Select", async function () {
            const selectMany = EnumerableAsync.asEnumerableAsync(petOwners).selectMany(async (petOwner) => Promise.resolve(petOwner.Pets));
            const select = EnumerableAsync.asEnumerableAsync(petOwners).select(async (petOwner) => Promise.resolve(petOwner.Pets));
            expect(await selectMany.toArray()).to.have.length(7);
            expect(await select.toArray()).to.have.length(4);
            expect(await selectMany.toArray()).to.be.eql(resultSelectMany);
            expect(await select.toArray()).to.be.eql(resultSelect);
        });
    });
});
