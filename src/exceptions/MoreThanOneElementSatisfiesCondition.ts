export class MoreThanOneElementSatisfiesCondition extends Error {
  constructor() {
    super("More than one element satisfies the condition");
  }
}
