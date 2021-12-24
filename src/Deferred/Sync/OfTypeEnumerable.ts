import { Enumerable } from "../../internal";

export class OfTypeEnumerable<T, TType> extends Enumerable<TType> {
    private readonly _typeCheck: (x: T) => boolean;
    constructor(source: Enumerable<T>, type: TType) {
        super(source as unknown as Enumerable<TType>);
        this._typeCheck = typeof type === "string" ? (x: T) => typeof x === type : (x: T) => x instanceof (type as never);
    }

    override [Symbol.iterator](): Iterator<TType> {
        return this._OfType();
    }
    private *_OfType() {
        const iterator = this._source[Symbol.iterator]();
        let current = iterator.next();
        while (current.done !== true) {
            if (this._typeCheck(current.value as unknown as T)) {
                yield current.value;
            }
            current = iterator.next();
        }
    }
}
