import * as t from 'io-ts';
import { isRight } from 'fp-ts/lib/Either';

export const createGuard = <A>(decoder: t.Type<A, A, unknown>): ((data: unknown) => data is A) => {
    return (data: unknown): data is A => {
        const decodeResult = decoder.decode(data);
        return isRight(decodeResult);
    };
};

