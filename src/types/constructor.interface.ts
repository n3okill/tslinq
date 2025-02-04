/**
 * Represents a type with a constructor
 * @internal
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export interface IConstructor<TResult> extends Function {
  readonly prototype: TResult;
  new (...args: Array<unknown>): TResult;
}
