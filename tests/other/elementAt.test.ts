import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect, use } from "chai";
import chaiAsPromised from "chai-as-promised";
use(chaiAsPromised);

describe("elementAt", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            expect(Enumerable.asEnumerable([1, 2, 3]).elementAt(1)).to.equal(2);
        });
        test("throw", function () {
            expect(() => Enumerable.asEnumerable([1, 2, 3]).elementAt(-1)).to.throw("'index' is out of range");
            expect(() => Enumerable.asEnumerable([1, 2, 3]).elementAt(5)).to.throw("'index' is out of range");
            expect(() => Enumerable.asEnumerable([]).elementAt(0)).to.throw("'index' is out of range");
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(e.elementAt(1)).to.equal(e.elementAt(1));
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            expect(await EnumerableAsync.asEnumerableAsync([1, 2, 3]).elementAt(1)).to.equal(2);
        });
        test("throw", async function () {
            await expect(EnumerableAsync.asEnumerableAsync([1, 2, 3]).elementAt(-1)).to.eventually.rejectedWith("'index' is out of range");
            await expect(EnumerableAsync.asEnumerableAsync([1, 2, 3]).elementAt(5)).to.eventually.rejectedWith("'index' is out of range");
            await expect(EnumerableAsync.asEnumerableAsync([]).elementAt(0)).to.eventually.rejectedWith("'index' is out of range");
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(await e.elementAt(1)).to.equal(await e.elementAt(1));
        });
    });
});
