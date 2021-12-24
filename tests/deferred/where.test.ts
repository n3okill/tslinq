import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("where", function () {
    const fruits = ["apple", "passionfruit", "banana", "mango", "orange", "blueberry", "grape", "strawberry"];
    const numbers = [0, 30, 20, 15, 90, 85, 40, 75];
    describe("Enumerable", function () {
        test("basic", function () {
            const e = Enumerable.asEnumerable(fruits).where((fruit) => fruit.length < 6);
            const result = ["apple", "mango", "grape"];
            expect(e.toArray()).to.be.eql(result);
        });
        test("index", function () {
            const e = Enumerable.asEnumerable(numbers).where((number, index) => number <= index * 10);
            const result = [0, 20, 15, 40];
            expect(e.toArray()).to.be.eql(result);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(fruits).where((fruit) => fruit.length < 6);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync(fruits).where((fruit) => fruit.length < 6);
            const result = ["apple", "mango", "grape"];
            expect(await e.toArray()).to.be.eql(result);
        });
        test("index", async function () {
            const e = EnumerableAsync.asEnumerableAsync(numbers).where((number, index) => number <= index * 10);
            const result = [0, 20, 15, 40];
            expect(await e.toArray()).to.be.eql(result);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync(fruits).where((fruit) => fruit.length < 6);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
    describe("EnumerableAsync async", function () {
        test("basic", async function () {
            const e = EnumerableAsync.asEnumerableAsync(fruits).where(async (fruit) => Promise.resolve(fruit.length < 6));
            const result = ["apple", "mango", "grape"];
            expect(await e.toArray()).to.be.eql(result);
        });
        test("index", async function () {
            const e = EnumerableAsync.asEnumerableAsync(numbers).where(async (number, index) => Promise.resolve(number <= index * 10));
            const result = [0, 20, 15, 40];
            expect(await e.toArray()).to.be.eql(result);
        });
    });
});
