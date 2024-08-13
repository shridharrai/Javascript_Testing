import {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  it,
} from "vitest";
import {
  calculateDiscount,
  canDrive,
  fetchData,
  getCoupons,
  isPriceInRange,
  Stack,
} from "../src/core";

describe("getCoupons", () => {
  it("should return an array of coupons", () => {
    const coupons = getCoupons();
    expect(Array.isArray(coupons)).toBe(true);
    expect(coupons.length).toBeGreaterThan(0);
  });

  it("should return an array with valid coupoun codes", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("code");
      expect(typeof coupon.code).toBe("string");
      expect(coupon.code).toBeTruthy();
    });
  });

  it("should return an array with valid discounts", () => {
    const coupons = getCoupons();
    coupons.forEach((coupon) => {
      expect(coupon).toHaveProperty("discount");
      expect(typeof coupon.discount).toBe("number");
      expect(coupon.discount).toBeGreaterThan(0);
      expect(coupon.discount).toBeLessThan(1);
    });
  });
});

describe("calculateDiscount", () => {
  // Positive testing
  it("should return discounted price if given valid code", () => {
    expect(calculateDiscount(10, "SAVE10")).toBe(9);
    expect(calculateDiscount(10, "SAVE20")).toBe(8);
  });

  /* 
  Negative testing
  toMatch :- is for matching regex string and 'i' is so that check should be case sensitive
  */
  it("should handle invalid price", () => {
    expect(calculateDiscount("10", "SAVE10")).toMatch(/Invalid/);
    expect(calculateDiscount(-10, "SAVE10")).toMatch(/invalid/i);
  });

  it("should handle non-string discount code", () => {
    expect(calculateDiscount(10, 10)).toMatch(/invalid/i);
  });

  it("should handle invalid discount code", () => {
    expect(calculateDiscount(10, "INVALID")).toBe(10);
  });
});

// Boundary Testing
describe("isPriceInRange", () => {
  it("should return false when the price is outside the range", () => {
    expect(isPriceInRange(-10, 0, 100)).toBe(false);
    expect(isPriceInRange(200, 0, 100)).toBe(false);
  });

  it("should return true when the price is equal to min or max", () => {
    expect(isPriceInRange(0, 0, 100)).toBe(true);
    expect(isPriceInRange(100, 0, 100)).toBe(true);
  });

  it("should return true when the price is within the range", () => {
    expect(isPriceInRange(5, 0, 100)).toBe(true);
    expect(isPriceInRange(100, 0, 100)).toBe(true);
  });
});

describe("canDrive", () => {
  it("should return error for invalid country code", () => {
    expect(canDrive(12, "FR")).toMatch(/invalid/i);
  });

  it("should return false for underage in the US", () => {
    expect(canDrive(15, "US")).toBe(false);
  });

  // Boundary Test
  it("should return true for min age in the US", () => {
    expect(canDrive(16, "US")).toBe(true);
  });

  it("should return true for eligible age in the US", () => {
    expect(canDrive(19, "US")).toBe(true);
  });

  it("should return false for underage in the UK", () => {
    expect(canDrive(16, "UK")).toBe(false);
  });

  // Boundary Test
  it("should return true for min age in the UK", () => {
    expect(canDrive(17, "UK")).toBe(true);
  });

  it("should return true for eligible age in the UK", () => {
    expect(canDrive(20, "UK")).toBe(true);
  });
});

/* Parameterized test :- If we want to write same type of test cases but with
                         different set of inputs as in above function */
describe("canDrive Parameterized Test", () => {
  it.each([
    { age: 15, country: "US", result: false },
    { age: 16, country: "US", result: true },
    { age: 19, country: "US", result: true },
    { age: 16, country: "UK", result: false },
    { age: 17, country: "UK", result: true },
    { age: 20, country: "UK", result: true },
  ])("should return $result for $age, $country", ({ age, country, result }) => {
    expect(canDrive(age, country)).toBe(result);
  });
});

// Testing Async code
describe("fetchData", () => {
  it("should return a promise that will resolve to an array of numbers ", async () => {
    try {
      const result = await fetchData();
      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    } catch (error) {
      expect(error).toHaveProperty("reason");
      expect(error.reason).toMatch(/fail/i);
    }
  });
});

// Before and after
describe("before and after", () => {
  // Before this test suite
  beforeAll(() => {
    console.log("Before All called");
  });

  // Before each test case in this test suite
  beforeEach(() => {
    console.log("Before Each called");
  });

  // After this whole test suite
  afterAll(() => {
    console.log("After all called");
  });

  // After each test case in this test suite
  afterEach(() => {
    console.log("After Each called ");
  });

  it("test case 1", () => {});
  it("test case 2", () => {});
});

describe("Stack", () => {
  let stack;
  beforeEach(() => {
    stack = new Stack();
  });

  it("push should add and element to the stack", () => {
    stack.push(2);

    expect(stack.size()).toBe(1);
  });

  it("pop should remove and return the top item from the stack", () => {
    stack.push(2);
    stack.push(3);

    const poppedItem = stack.pop();

    expect(poppedItem).toBe(3);
    expect(stack.size()).toBe(1);
  });

  it("pop should throw an error if stack is empty", () => {
    expect(() => stack.pop()).toThrow(/empty/i);
  });

  it("peek should return the top item from the stack without removing the element", () => {
    stack.push(2);
    stack.push(3);

    const peekItem = stack.peek();

    expect(peekItem).toBe(3);
    expect(stack.size()).toBe(2);
  });

  it("peek should throw an error if stack is empty", () => {
    expect(() => stack.peek()).toThrow(/empty/i);
  });

  it("isEmpty should return true if stack is empty", () => {
    expect(stack.isEmpty()).toBe(true);
  });

  it("isEmpty should return false if stack is not empty", () => {
    stack.push(10);

    expect(stack.isEmpty()).toBe(false);
  });

  it("size should return the number of items in the stack", () => {
    stack.push(10);
    stack.push(20);
    stack.push(30);

    expect(stack.size()).toBe(3);
  });

  it("clear should remove all items from the stack", () => {
    stack.push(10);
    stack.push(30);

    stack.clear();

    expect(stack.size()).toBe(0);
  });
});
