import { EnumerableAsync } from "../../internal";

export class WhereEnumerable<T> extends EnumerableAsync<T> {
    constructor(source: EnumerableAsync<T>, private readonly _predicate: (x: T, index: number) => boolean | Promise<boolean>) {
        super(source);
    }

    override [Symbol.asyncIterator](): AsyncIterator<T> {
        return this._Where();
    }

    private async *_Where() {
        const iterator = this._source[Symbol.asyncIterator]();
        let current = await iterator.next();
        let index = 0;
        while (current.done !== true) {
            if (await this._predicate(current.value, index)) {
                yield current.value;
            }
            index++;
            current = await iterator.next();
        }
    }
}
