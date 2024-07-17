import { describe, expect, it } from "vitest";
import { fizzBuzz, max } from "../src/intro";

describe("max", () => {
  it("should return the first argumnet if it is greater", () => {
    const result = max(2, 1);
    expect(result).toBe(2);
  });

  it("should return the second argumnet if it is greater", () => {
    const result = max(1, 2);
    expect(result).toBe(2);
  });

  it("should return first argumnet if arguments are equal", () => {
    const result = max(1, 1);
    expect(result).toBe(1);
  });
});

describe("fizzBuzz", () => {
  it("should return FizzBuzz if arg is divisible by 3 and 5", () => {
    const result = fizzBuzz(15);
    expect(result).toBe("FizzBuzz");
  });

  it("should return Fizz if arg is divisible by 3", () => {
    const result = fizzBuzz(6);
    expect(result).toBe("Fizz");
  });

  it("should return Buzz if arg is divisible by 5", () => {
    const result = fizzBuzz(10);
    expect(result).toBe("Buzz");
  });

  it("should return arg as a string if not divisible by 3 or 5", () => {
    const result = fizzBuzz(1);
    expect(result).toBe("1");
  });
});
