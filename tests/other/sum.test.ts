import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("sum", function () {
    class Package {
        constructor(public Company: string, public Weight: number) {}
    }
    const packages = [new Package("Coho Vineyard", 25), new Package("Lucerne Publishing", 18), new Package("Wingtip Toys", 6), new Package("Adventure Works", 33)];
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([null, 0, 92, null, 100, 37, 81]).sum()).to.equal(310);
            expect(Enumerable.asEnumerable([43, 1, 583, 6]).sum()).to.equal(633);
            expect(() => Enumerable.asEnumerable([]).sum()).to.throw();
            expect(Enumerable.asEnumerable(["Hello", " ", "World"]).sum()).to.equal("Hello World");
        });
        test("selector", function () {
            expect(Enumerable.asEnumerable(packages).sum((pkg) => pkg.Weight)).to.equal(82);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.sum()).to.equal(e.sum());
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([null, 0, 92, null, 100, 37, 81]).sum()).to.equal(310);
            expect(await EnumerableAsync.asEnumerableAsync([43, 1, 583, 6]).sum()).to.equal(633);
            await expect(EnumerableAsync.asEnumerableAsync([]).sum()).to.eventually.rejected;
            expect(await EnumerableAsync.asEnumerableAsync(["Hello", " ", "World"]).sum()).to.equal("Hello World");
        });
        test("selector", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(packages).sum((pkg) => pkg.Weight)).to.equal(82);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.sum()).to.equal(await e.sum());
        });
    });
    describe("EnumerableAsync async", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([null, 0, 92, null, 100, 37, 81]).sum()).to.equal(310);
            expect(await EnumerableAsync.asEnumerableAsync([43, 1, 583, 6]).sum()).to.equal(633);
            await expect(EnumerableAsync.asEnumerableAsync([]).sum()).to.eventually.rejected;
            expect(await EnumerableAsync.asEnumerableAsync(["Hello", " ", "World"]).sum()).to.equal("Hello World");
        });
        test("selector", async function () {
            expect(await EnumerableAsync.asEnumerableAsync(packages).sum(async (pkg) => Promise.resolve(pkg.Weight))).to.equal(82);
        });
    });
});
