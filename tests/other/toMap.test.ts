import { Enumerable, EnumerableAsync } from "../../src/internal";
import { describe, test } from "mocha";
import { expect } from "chai";

describe("toMap", function () {
    describe("Enumerable", function () {
        test("basic", function () {
            const map = Enumerable.asEnumerable([1, 2, 3]).toMap((x) => `Key_${x}`);
            expect(Array.from(map)).to.be.eql([
                ["Key_1", [1]],
                ["Key_2", [2]],
                ["Key_3", [3]],
            ]);
        });
        test("repeated calls", function () {
            const e = Enumerable.asEnumerable([1, 2, 3]);
            expect(Array.from(e.toMap((x) => x))).to.be.eql(Array.from(e.toMap((x) => x)));
        });
    });
    describe("EnumerableAsync", function () {
        test("basic", async function () {
            const map = await EnumerableAsync.asEnumerableAsync([1, 2, 3]).toMap((x) => `Key_${x}`);
            expect(Array.from(map)).to.be.eql([
                ["Key_1", [1]],
                ["Key_2", [2]],
                ["Key_3", [3]],
            ]);
        });
        test("repeated calls", async function () {
            const e = EnumerableAsync.asEnumerableAsync([1, 2, 3]);
            expect(Array.from(await e.toMap((x) => x))).to.be.eql(Array.from(await e.toMap((x) => x)));
        });
    });
    describe("EnumerableAsync async keySelector", function () {
        test("basic", async function () {
            const map = await EnumerableAsync.asEnumerableAsync([1, 2, 3]).toMap(async (x) => Promise.resolve(`Key_${x}`));
            expect(Array.from(map)).to.be.eql([
                ["Key_1", [1]],
                ["Key_2", [2]],
                ["Key_3", [3]],
            ]);
        });
    });
});
