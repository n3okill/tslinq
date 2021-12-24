import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("exceptBy", function () {
    class Comparer extends Interfaces.IEqualityComparer<Product> {
        Equals(x?: Product, y?: Product): boolean {
            return x?.Code === y?.Code && x?.Name === y?.Name;
        }
    }

    class Product {
        Name: string;
        Code: number;
        constructor(name: string, code: number) {
            this.Name = name;
            this.Code = code;
        }
    }
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3, 4, 5]).exceptBy([3, 4]).toArray()).to.be.eql([1, 2, 5]);
            expect(Enumerable.asEnumerable([1, 2, 3, 4, 5]).exceptBy([2]).exceptBy([4]).toArray()).to.be.eql([1, 3, 5]);
        });
        test("Comparer", function () {
            const p1: Product = new Product("apple", 9);
            const p2: Product = new Product("orange", 4);
            const p3: Product = new Product("apple", 9);
            const p4: Product = new Product("lemon", 12);
            const p5: Product = new Product("apple", 10);
            const products = [p1, p2, p3, p4, p5];
            expect(
                Enumerable.asEnumerable(products)
                    .exceptBy([p1, p5], (x) => x, new Comparer())
                    .toArray()
            ).to.be.eql([p2, p4]);
            expect(
                Enumerable.asEnumerable(products)
                    .exceptBy([2, 4, 9], (x) => x.Code)
                    .toArray()
            ).to.be.eql([p4, p5]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2]).exceptBy([2]);
            expect(e.toArray()).to.be.eql(e.toArray());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5]).exceptBy([3, 4]).toArray()).to.be.eql([1, 2, 5]);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5]).exceptBy([2]).exceptBy([4]).toArray()).to.be.eql([1, 3, 5]);
        });
        test("Comparer", async function () {
            const p1: Product = new Product("apple", 9);
            const p2: Product = new Product("orange", 4);
            const p3: Product = new Product("apple", 9);
            const p4: Product = new Product("lemon", 12);
            const p5: Product = new Product("apple", 10);
            const products = [p1, p2, p3, p4, p5];
            expect(
                await EnumerableAsync.asEnumerableAsync(products)
                    .exceptBy([p1, p5], (x) => x, new Comparer())
                    .toArray()
            ).to.be.eql([p2, p4]);
            expect(
                await EnumerableAsync.asEnumerableAsync(products)
                    .exceptBy([2, 4, 9], (x) => x.Code)
                    .toArray()
            ).to.be.eql([p4, p5]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2]).exceptBy([2]);
            expect(await e.toArray()).to.be.eql(await e.toArray());
        });
    });
    describe("EnumerableAsync comparer async", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5]).exceptBy([3, 4]).toArray()).to.be.eql([1, 2, 5]);
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3, 4, 5]).exceptBy([2]).exceptBy([4]).toArray()).to.be.eql([1, 3, 5]);
        });
        test("Comparer", async function () {
            class ComparerAsync extends Interfaces.IAsyncEqualityComparer<Product> {
                async Equals(x?: Product, y?: Product): Promise<boolean> {
                    return Promise.resolve(x?.Code === y?.Code && x?.Name === y?.Name);
                }
            }
            const p1: Product = new Product("apple", 9);
            const p2: Product = new Product("orange", 4);
            const p3: Product = new Product("apple", 9);
            const p4: Product = new Product("lemon", 12);
            const products = [p1, p2, p3, p4];
            expect(
                await EnumerableAsync.asEnumerableAsync(products)
                    .exceptBy([p1], (x) => x, new ComparerAsync())
                    .toArray()
            ).to.be.eql([p2, p4]);
        });
    });
});
