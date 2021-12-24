import { Type } from "@n3okill/utils";
import { Types, Exceptions } from "../internal";

export const aggregate = <TSource, TAccumulate, TResult>(iterator: Iterator<TSource>, seed: TAccumulate | Types.AggregateFunctionType<TSource, TAccumulate>, func: Types.AggregateFunctionType<TSource, TAccumulate>, resultSelector: Types.AggregateResultType<TAccumulate, TResult>): TResult => {
    let result: TAccumulate;
    let method: Types.AggregateFunctionType<TSource, TAccumulate>;
    let selector: Types.AggregateResultType<TAccumulate, TResult>;
    if (Type.isFunction(seed)) {
        const current = iterator.next();
        if (current.done) {
            throw Exceptions.ThrowNoElementsException;
        }
        result = current.value as unknown as TAccumulate;
        method = seed as Types.AggregateFunctionType<TSource, TAccumulate>;
        selector = func as unknown as Types.AggregateResultType<TAccumulate, TResult>;
    } else {
        result = seed as TAccumulate;
        method = func;
        selector = resultSelector;
    }
    let current = iterator.next();
    while (current.done !== true) {
        result = method(result, current.value);
        current = iterator.next();
    }

    return selector(result);
};
