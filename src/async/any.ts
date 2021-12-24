import { Type } from "@n3okill/utils";

export const any = async <T>(iterator: AsyncIterator<T>, predicate?: (x: T) => boolean | Promise<boolean>): Promise<boolean> => {
    let current = await iterator.next();
    if (!Type.isFunctionType(predicate)) {
        return !current.done;
    }
    while (current.done !== true) {
        if (await (predicate as CallableFunction)(current.value)) {
            return true;
        }
        current = await iterator.next();
    }
    return false;
};
