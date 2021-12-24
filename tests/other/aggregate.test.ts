import { Enumerable, EnumerableAsync, Exceptions } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("Aggregate", function () {
    const simpleArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    describe("Enumerable", function () {
        test("simple plus number aggregate", function () {
            const val = Enumerable.asEnumerable(simpleArray).aggregate((a, b) => a + b);
            expect(val).to.equal(55);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable(simpleArray);
            expect(e.aggregate((a, b) => a + b)).to.equal(e.aggregate((a, b) => a + b));
        });
        test("simple multiply number aggregate", function () {
            const val = Enumerable.asEnumerable(simpleArray).aggregate((a, b) => a * b);
            expect(val).to.equal(3628800);
        });
        test("transform aggregate", function () {
            const val = Enumerable.asEnumerable(simpleArray).aggregate(
                1,
                (a, b) => a * b,
                (o) => o / 2
            );
            expect(val).to.equal(1814400);
        });
        test("defaultValue 'string' aggregate", function () {
            const val = Enumerable.asEnumerable([1, 2, 3]).aggregate("", (a: unknown, b: unknown) => `${(a as number).toString()}${(b as number).toString()}`);
            expect(val).to.equal("123");
        });
        test("single element", function () {
            expect(Enumerable.asEnumerable([5]).aggregate((x, y) => x + y)).to.equal(5);
        });
        test("empty source and seed", function () {
            expect(Enumerable.asEnumerable([]).aggregate(2, (x, y) => x * y)).to.equal(2);
        });
        test("single element and seed", function () {
            expect(Enumerable.asEnumerable([5]).aggregate(2, (x, y) => x * y)).to.equal(10);
        });
        test("two elements and seed", function () {
            expect(Enumerable.asEnumerable([5, 6]).aggregate(2, (x, y) => x * y)).to.equal(60);
        });
        test("no elements seed and result selector", function () {
            expect(
                Enumerable.asEnumerable([]).aggregate(
                    2,
                    (x, y) => x * y,
                    (x) => x + 5
                )
            ).to.equal(7);
        });
        test("single element seed and result selector", function () {
            expect(
                Enumerable.asEnumerable([5]).aggregate(
                    2,
                    (x, y) => x * y,
                    (x) => x + 5
                )
            ).to.equal(15);
        });
        test("two elements seed and result selector", function () {
            expect(
                Enumerable.asEnumerable([5, 6]).aggregate(
                    2,
                    (x, y) => x * y,
                    (x) => x + 5
                )
            ).to.equal(65);
        });
        test("Basic", function () {
            expect(Enumerable.asEnumerable(["f", "o", "o"]).aggregate((x, y) => x + y)).to.equal("foo");

            const sentence = "the quick brown fox jumps over the lazy dog";
            // Split the string into individual words.
            const words = Enumerable.asEnumerable(sentence.split(" "));
            // Prepend each word to the beginning of the
            // new sentence to reverse the word order.
            const reversed = words.aggregate((workingSentence, next) => next + " " + workingSentence);
            expect(reversed).to.equal("dog lazy the over jumps fox brown quick the");
        });
        test("String", function () {
            expect(Enumerable.asEnumerable("thisisthemostboringpartofcoding").aggregate((x, y) => x + y)).to.equal("thisisthemostboringpartofcoding");
        });
        test("ResultSelector", function () {
            const fruits = Enumerable.asEnumerable(["apple", "mango", "orange", "passionfruit", "grape"]);

            // Determine whether any string in the array is longer than "banana".
            const longestName = fruits.aggregate(
                "banana",
                (longest, next) => (next.length > longest.length ? next : longest),
                // Return the final result as an upper case string.
                (fruit) => fruit.toUpperCase()
            );

            expect(longestName).to.equal("PASSIONFRUIT");
        });

        test("Exception", function () {
            expect(() => Enumerable.asEnumerable<number>([]).aggregate((x, y) => x + y)).to.throw(Exceptions.ThrowNoElementsException);
        });
    });

    describe("EnumerableAsync", function () {
        test("simple plus number aggregate", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate((a, b) => a + b)).to.equal(55);
        });
        test("repeated calls", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate((a, b) => a + b)).to.equal(await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate((a, b) => a + b));
        });
        test("simple multiply number aggregate", async function () {
            const val = await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate((a, b) => a * b);
            expect(val).to.equal(3628800);
        });
        test("transform aggregate", async function () {
            const val = await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(
                1,
                (a, b) => a * b,
                (o) => o / 2
            );
            expect(val).to.equal(1814400);
        });
        test("defaultValue 'string' aggregate", async function () {
            const val = await EnumerableAsync.asEnumerableAsync([1, 2, 3]).aggregate("", (a: unknown, b: unknown) => `${(a as number).toString()}${(b as number).toString()}`);
            expect(val).to.equal("123");
        });
        test("single element", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([5]).aggregate((x, y) => x + y)).to.equal(5);
        });
        test("empty source and seed", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([]).aggregate(2, (x, y) => x * y)).to.equal(2);
        });
        test("single element and seed", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([5]).aggregate(2, (x, y) => x * y)).to.equal(10);
        });
        test("two elements and seed", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([5, 6]).aggregate(2, (x, y) => x * y)).to.equal(60);
        });
        test("no elements seed and result selector", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([]).aggregate(
                    2,
                    (x, y) => x * y,
                    (x) => x + 5
                )
            ).to.equal(7);
        });
        test("single element seed and result selector", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([5]).aggregate(
                    2,
                    (x, y) => x * y,
                    (x) => x + 5
                )
            ).to.equal(15);
        });
        test("two elements seed and result selector", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([5, 6]).aggregate(
                    2,
                    (x, y) => x * y,
                    (x) => x + 5
                )
            ).to.equal(65);
        });
        test("Basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(["f", "o", "o"]).aggregate((x, y) => x + y)).to.equal("foo");

            const sentence = "the quick brown fox jumps over the lazy dog";
            // Split the string into individual words.
            const words = EnumerableAsync.asEnumerableAsync(sentence.split(" "));
            // Prepend each word to the beginning of the
            // new sentence to reverse the word order.
            const reversed = await words.aggregate((workingSentence, next) => next + " " + workingSentence);
            expect(reversed).to.equal("dog lazy the over jumps fox brown quick the");
        });
        test("ResultSelector", async function () {
            const fruits = EnumerableAsync.asEnumerableAsync(["apple", "mango", "orange", "passionfruit", "grape"]);

            // Determine whether any string in the array is longer than "banana".
            const longestName = await fruits.aggregate(
                "banana",
                (longest, next) => (next.length > longest.length ? next : longest),
                // Return the final result as an upper case string.
                (fruit) => fruit.toUpperCase()
            );

            expect(longestName).to.equal("PASSIONFRUIT");
        });
        test("Exception", async function () {
            await expect(EnumerableAsync.asEnumerableAsync<number>([]).aggregate((x, y) => x + y)).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
        });
    });
    describe("EnumerableAsync async accumulator and selector", function () {
        test("simple plus number aggregate", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(async (a, b) => Promise.resolve(a + b))).to.equal(55);
        });
        test("repeated calls", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(async (a, b) => Promise.resolve(a + b))).to.equal(await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(async (a, b) => Promise.resolve(a + b)));
        });
        test("simple multiply number aggregate", async function () {
            const val = await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(async (a, b) => Promise.resolve(a * b));
            expect(val).to.equal(3628800);
        });
        test("transform aggregate", async function () {
            const val = await EnumerableAsync.asEnumerableAsync(simpleArray).aggregate(
                1,
                async (a, b) => Promise.resolve(a * b),
                async (o) => Promise.resolve(o / 2)
            );
            expect(val).to.equal(1814400);
        });
        test("defaultValue 'string' aggregate", async function () {
            const val = await EnumerableAsync.asEnumerableAsync([1, 2, 3]).aggregate("", async (a: unknown, b: unknown) => Promise.resolve(`${(a as number).toString()}${(b as number).toString()}`));
            expect(val).to.equal("123");
        });
        test("single element", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([5]).aggregate(async (x, y) => Promise.resolve(x + y))).to.equal(5);
        });
        test("empty source and seed", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([]).aggregate(2, async (x, y) => Promise.resolve(x * y))).to.equal(2);
        });
        test("single element and seed", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([5]).aggregate(2, async (x, y) => Promise.resolve(x * y))).to.equal(10);
        });
        test("two elements and seed", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([5, 6]).aggregate(2, async (x, y) => Promise.resolve(x * y))).to.equal(60);
        });
        test("no elements seed and result selector", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([]).aggregate(
                    2,
                    async (x, y) => Promise.resolve(x * y),
                    async (x) => Promise.resolve(x + 5)
                )
            ).to.equal(7);
        });
        test("single element seed and result selector", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([5]).aggregate(
                    2,
                    async (x, y) => Promise.resolve(x * y),
                    async (x) => Promise.resolve(x + 5)
                )
            ).to.equal(15);
        });
        test("two elements seed and result selector", async function () {
            expect(
                await EnumerableAsync.asEnumerableAsync([5, 6]).aggregate(
                    2,
                    async (x, y) => Promise.resolve(x * y),
                    async (x) => Promise.resolve(x + 5)
                )
            ).to.equal(65);
        });
        test("Basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(["f", "o", "o"]).aggregate(async (x, y) => Promise.resolve(x + y))).to.equal("foo");

            const sentence = "the quick brown fox jumps over the lazy dog";
            // Split the string into individual words.
            const words = EnumerableAsync.asEnumerableAsync(sentence.split(" "));
            // Prepend each word to the beginning of the
            // new sentence to reverse the word order.
            const reversed = await words.aggregate(async (workingSentence, next) => Promise.resolve(next + " " + workingSentence));
            expect(reversed).to.equal("dog lazy the over jumps fox brown quick the");
        });
        test("ResultSelector", async function () {
            const fruits = EnumerableAsync.asEnumerableAsync(["apple", "mango", "orange", "passionfruit", "grape"]);

            // Determine whether any string in the array is longer than "banana".
            const longestName = await fruits.aggregate(
                "banana",
                async (longest, next) => Promise.resolve(next.length > longest.length ? next : longest),
                // Return the final result as an upper case string.
                async (fruit) => Promise.resolve(fruit.toUpperCase())
            );

            expect(longestName).to.equal("PASSIONFRUIT");
        });
        test("Exception", async function () {
            await expect(EnumerableAsync.asEnumerableAsync<number>([]).aggregate(async (x, y) => Promise.resolve(x + y))).to.eventually.rejectedWith(Exceptions.ThrowNoElementsException);
        });
    });
});
