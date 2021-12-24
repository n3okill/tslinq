import { Type } from "@n3okill/utils";

export const any = <T>(iterator: Iterator<T>, predicate?: (x: T) => boolean): boolean => {
    let current = iterator.next();
    if (!Type.isFunction(predicate)) {
        return !current.done;
    }
    while (current.done !== true) {
        if ((predicate as CallableFunction)(current.value)) {
            return true;
        }
        current = iterator.next();
    }
    return false;
};
