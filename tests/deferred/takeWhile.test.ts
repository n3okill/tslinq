import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("takeWhile", function () {
    const fruits = ["apple", "banana", "mango", "orange", "passionfruit", "grape"];
    const fruits2 = ["apple", "passionfruit", "banana", "mango", "orange", "blueberry", "grape", "strawberry"];
    describe("Enumerable", function () {
        test("basic", function () {
            const e = Enumerable.asEnumerable(fruits).takeWhile((fruit) => fruit !== "orange");
            expect(e.toArray()).to.be.eql(["apple", "banana", "mango"]);
            const e2 = Enumerable.asEnumerable(fruits2).takeWhile((fruit, index) => fruit.length >= index);
            expect(e2.toArray()).to.be.eql(["apple", "passionfruit", "banana", "mango", "orange", "blueberry"]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(fruits).takeWhile((fruit) => fruit !== "orange");
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync(fruits).takeWhile((fruit) => fruit !== "orange");
            expect(await e.toArray()).to.be.eql(["apple", "banana", "mango"]);
            const e2 = EnumerableAsync.asEnumerableAsync(fruits2).takeWhile((fruit, index) => fruit.length >= index);
            expect(await e2.toArray()).to.be.eql(["apple", "passionfruit", "banana", "mango", "orange", "blueberry"]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync(fruits).takeWhile((fruit) => fruit !== "orange");
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
    describe("EnumerableAsync async", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync(fruits).takeWhile(async (fruit) => Promise.resolve(fruit !== "orange"));
            expect(await e.toArray()).to.be.eql(["apple", "banana", "mango"]);
            const e2 = EnumerableAsync.asEnumerableAsync(fruits2).takeWhile(async (fruit, index) => Promise.resolve(fruit.length >= index));
            expect(await e2.toArray()).to.be.eql(["apple", "passionfruit", "banana", "mango", "orange", "blueberry"]);
        });
    });
});
