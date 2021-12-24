import { Type } from "@n3okill/utils";
import { Types, Exceptions } from "../internal";

export const aggregate = async <TSource, TAccumulate, TResult>(iterator: AsyncIterator<TSource>, seed: TAccumulate | Types.AggregateFunctionTypeAsync<TSource, TAccumulate>, func: Types.AggregateFunctionTypeAsync<TSource, TAccumulate>, resultSelector: Types.AggregateResultTypeAsync<TAccumulate, TResult>): Promise<TResult> => {
    let result: TAccumulate;
    let method: Types.AggregateFunctionTypeAsync<TSource, TAccumulate>;
    let selector: Types.AggregateResultTypeAsync<TAccumulate, TResult>;
    if (Type.isFunctionType(seed)) {
        const current = await iterator.next();
        if (current.done) {
            throw Exceptions.ThrowNoElementsException;
        }
        result = current.value as unknown as TAccumulate;
        method = seed as Types.AggregateFunctionTypeAsync<TSource, TAccumulate>;
        selector = func as unknown as Types.AggregateResultTypeAsync<TAccumulate, TResult>;
    } else {
        result = seed as TAccumulate;
        method = func;
        selector = resultSelector;
    }
    let current = await iterator.next();
    while (current.done !== true) {
        result = await method(result, current.value);
        current = await iterator.next();
    }

    return await selector(result);
};
