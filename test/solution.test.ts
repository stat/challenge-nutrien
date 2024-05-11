import { solutionA, solutionB } from "../src/solution";

describe("solutionA", () => {
  it("should work", () => {
    expect(solutionA('act','cat')).toBe(true);
  });
});

describe("solutionB", () => {
  it("should work", () => {
    expect(solutionB('listen silent earth heart hello world')).toStrictEqual([
      ['listen', 'slient'],
      ['earth', 'heart'],
    ]);
  });
});