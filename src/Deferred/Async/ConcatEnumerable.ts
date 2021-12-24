import { EnumerableAsync, Helpers } from "../../internal";

export class ConcatEnumerable<T> extends EnumerableAsync<T> {
    private readonly _second: AsyncIterable<T>;
    constructor(source: EnumerableAsync<T>, second: AsyncIterable<T> | Iterable<T>) {
        super(source);
        this._second = Helpers.asAsyncIterable(second);
    }
    override [Symbol.asyncIterator](): AsyncIterator<T> {
        return this._Concat();
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    private async *_Concat() {
        yield* this._source;
        yield* this._second;
    }
}
