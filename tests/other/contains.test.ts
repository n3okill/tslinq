import { Enumerable, EnumerableAsync, Interfaces } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("Contains", function () {
    class Comparer extends Interfaces.IEqualityComparer<number> {
        Equals(x?: number, y?: number): boolean {
            return (x as number) + 1 == y;
        }
    }
    describe("Enumerable", function () {
        test("true", function () {
            const c = Enumerable.asEnumerable([-1, 0, 2]);
            expect(c.contains(-1)).to.be.true;
            expect(c.contains(-1)).to.equal(c.contains(-1));
            expect(c.contains(3, new Comparer())).to.be.true;
        });
        test("false", function () {
            const c = Enumerable.asEnumerable([-1, 0, 2]);
            expect(c.contains(3)).to.be.false;
            expect(c.contains(4, new Comparer())).to.be.false;
            expect(c.contains("2" as unknown as number)).to.be.false;
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([-1, 0, 2]);
            expect(e.contains(-1)).to.equal(e.contains(-1));
        });
    });
    describe("EnumerableAsync", function () {
        test("true", async function () {
            const c = EnumerableAsync.asEnumerableAsync([-1, 0, 2]);
            expect(await c.contains(-1)).to.be.true;
            expect(await c.contains(-1)).to.equal(await c.contains(-1));
            expect(await c.contains(3, new Comparer())).to.be.true;
        });
        test("false", async function () {
            const c = EnumerableAsync.asEnumerableAsync([-1, 0, 2]);
            expect(await c.contains(3)).to.be.false;
            expect(await c.contains(4, new Comparer())).to.be.false;
            expect(await c.contains("2" as unknown as number)).to.be.false;
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([-1, 0, 2]);
            expect(await e.contains(-1)).to.equal(await e.contains(-1));
        });
    });
    describe("EnumerableAsync async comparer", function () {
        class ComparerAsync extends Interfaces.IAsyncEqualityComparer<number> {
            async Equals(x?: number, y?: number): Promise<boolean> {
                return Promise.resolve((x as number) + 1 == y);
            }
        }
        test("true", async function () {
            const c = EnumerableAsync.asEnumerableAsync([-1, 0, 2]);
            expect(await c.contains(-1)).to.be.true;
            expect(await c.contains(-1)).to.equal(await c.contains(-1));
            expect(await c.contains(3, new ComparerAsync())).to.be.true;
        });
        test("false", async function () {
            const c = EnumerableAsync.asEnumerableAsync([-1, 0, 2]);
            expect(await c.contains(3)).to.be.false;
            expect(await c.contains(4, new ComparerAsync())).to.be.false;
            expect(await c.contains("2" as unknown as number)).to.be.false;
        });
    });
});
