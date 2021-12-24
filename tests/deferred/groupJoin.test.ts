import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("groupJoin", function () {
    class Person {
        constructor(public Name: string) {}
    }
    class Pet {
        constructor(public Name: string, public Owner: Person) {}
    }
    const magnus = new Person("Hedlund, Magnus");
    const terry = new Person("Adams, Terry");
    const charlotte = new Person("Weiss, Charlotte");

    const barley = new Pet("Barley", terry);
    const boots = new Pet("Boots", terry);
    const whiskers = new Pet("Whiskers", charlotte);
    const daisy = new Pet("Daisy", magnus);

    const people = [magnus, terry, charlotte];
    const pets = [barley, boots, whiskers, daisy];
    describe("Enumerable", function () {
        test("basic", function () {
            const e = Enumerable.asEnumerable(people);
            const grouping = e.groupJoin(
                Enumerable.asEnumerable(pets),
                (person) => person,
                (pet) => pet.Owner,
                (person, petCollection) => {
                    return { OwnerName: person.Name, Pets: petCollection.select((pet) => pet.Name).toArray() };
                }
            );
            expect(grouping.toArray()).to.be.eql([
                { OwnerName: "Hedlund, Magnus", Pets: ["Daisy"] },
                { OwnerName: "Adams, Terry", Pets: ["Barley", "Boots"] },
                { OwnerName: "Weiss, Charlotte", Pets: ["Whiskers"] },
            ]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(people);
            const grouping = e.groupJoin(
                Enumerable.asEnumerable(pets),
                (person) => person,
                (pet) => pet.Owner,
                (person, petCollection) => {
                    return { OwnerName: person.Name, Pets: petCollection.select((pet) => pet.Name).toArray() };
                }
            );
            expect(grouping.toArray()).to.be.eql(grouping.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync(people);
            const grouping = e.groupJoin(
                EnumerableAsync.asEnumerableAsync(pets),
                (person) => person,
                (pet) => pet.Owner,
                (person, petCollection) => {
                    return { OwnerName: person.Name, Pets: petCollection.select((pet: Pet) => pet.Name).toArray() };
                }
            );
            expect(await grouping.toArray()).to.be.eql([
                { OwnerName: "Hedlund, Magnus", Pets: ["Daisy"] },
                { OwnerName: "Adams, Terry", Pets: ["Barley", "Boots"] },
                { OwnerName: "Weiss, Charlotte", Pets: ["Whiskers"] },
            ]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync(people);
            const grouping = e.groupJoin(
                EnumerableAsync.asEnumerableAsync(pets),
                (person) => person,
                (pet) => pet.Owner,
                (person, petCollection) => {
                    return { OwnerName: person.Name, Pets: petCollection.select((pet: Pet) => pet.Name).toArray() };
                }
            );
            expect(await grouping.toArray()).to.be.eql(await grouping.toArray());
        });
    });
    describe("EnumerableAsync async", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync(people);
            const grouping = e.groupJoin(
                EnumerableAsync.asEnumerableAsync(pets),
                async (person) => Promise.resolve(person),
                async (pet) => Promise.resolve(pet.Owner),
                async (person, petCollection) => Promise.resolve({ OwnerName: person.Name, Pets: await petCollection.select((pet: Pet) => pet.Name).toArray() })
            );
            expect(await grouping.toArray()).to.be.eql([
                { OwnerName: "Hedlund, Magnus", Pets: ["Daisy"] },
                { OwnerName: "Adams, Terry", Pets: ["Barley", "Boots"] },
                { OwnerName: "Weiss, Charlotte", Pets: ["Whiskers"] },
            ]);
        });
    });
});
