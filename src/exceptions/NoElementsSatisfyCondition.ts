export class NoElementsSatisfyCondition extends Error {
  constructor() {
    super("No element satisfies the condition in predicate.");
  }
}
