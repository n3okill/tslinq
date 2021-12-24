import { EnumerableAsync, Helpers, Types } from "../../internal";

export class ZipEnumerable<T, TSecond, TThird, TResult> extends EnumerableAsync<TResult> {
    constructor(source: EnumerableAsync<T>, private readonly _second: AsyncIterable<TSecond>, private readonly _third: AsyncIterable<TThird> | undefined, private readonly _resultSelector: Types.ZipResultSelectorAsync<T, TSecond, TThird, TResult>) {
        super(source as unknown as EnumerableAsync<TResult>);
    }

    override [Symbol.asyncIterator](): AsyncIterator<TResult> {
        return this._Zip();
    }
    private async *_Zip() {
        const iterator1 = this._source[Symbol.asyncIterator]() as AsyncIterator<T>;
        const iterator2 = this._second[Symbol.asyncIterator]();
        const iterator3 = this._third ? this._third[Symbol.asyncIterator]() : Helpers.asAsyncIterable([])[Symbol.asyncIterator]();

        let current1 = await iterator1.next();
        let current2 = await iterator2.next();
        let current3 = this._third ? await iterator3.next() : { done: false, value: undefined };

        while (current1.done !== true && current2.done !== true && current3.done !== true) {
            if (this._third) {
                yield await this._resultSelector(current1.value, current2.value, current3.value);
                current3 = await iterator3.next();
            } else {
                yield await this._resultSelector(current1.value, current2.value);
            }

            current1 = await iterator1.next();
            current2 = await iterator2.next();
        }
    }
}
