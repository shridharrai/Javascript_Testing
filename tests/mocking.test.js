import { describe, expect, it, vi } from "vitest";
import { getExchangeRate } from "../src/libs/currency";
import {
  getPriceInCurrency,
  getShippingInfo,
  isOnline,
  login,
  renderPage,
  signUp,
  submitOrder,
} from "../src/mocking";
import { getShippingQuote } from "../src/libs/shipping";
import { trackPageView } from "../src/libs/analytics";
import { charge } from "../src/libs/payment";
import { sendEmail } from "../src/libs/email";
import security from "../src/libs/security";

/* It is hoisted at top and it will basically mock all the exported functions
of a file path with no definition just empty functions */
vi.mock("../src/libs/currency");
vi.mock("../src/libs/shipping");
vi.mock("../src/libs/analytics");
vi.mock("../src/libs/payment");

// Partial mocking :- Only mocking some specific functions of a file and remainig func. are as it is used
vi.mock("../src/libs/email", async (importModules) => {
  const modules = await importModules();

  return {
    ...modules,
    sendEmail: vi.fn(),
  };
});

describe("mocking test case", () => {
  it("sendText message mock", () => {
    // Create a mock of the function
    const sendText = vi.fn();
    sendText.mockReturnValue("OK");

    // Call the mock function
    const result = sendText("message");

    // Write assertions
    expect(sendText).toHaveBeenCalledWith("message");
    expect(result).toBe("OK");
  });
});

describe("getPriceInCurrency", () => {
  it("should return price in target currency", () => {
    // Give Definition of mocked module function
    vi.mocked(getExchangeRate).mockReturnValue(1.5);

    const price = getPriceInCurrency(10, "AUD");

    expect(price).toBe(15);
  });
});

describe("getShippingInfo", () => {
  it("should return shipping unavailable if quote cannot be fetched", () => {
    vi.mocked(getShippingQuote).mockReturnValue(null);

    const result = getShippingInfo("London");

    expect(result).toMatch(/unavailable/i);
  });

  it("should return shipping info if quote can be fetched", () => {
    vi.mocked(getShippingQuote).mockReturnValue({ cost: 10, estimatedDays: 2 });

    const result = getShippingInfo("India");

    // expect(result).toMatch(/cost: \$10/i);
    // expect(result).toMatch(/\(2 Days\)/i);
    expect(result).toMatch(/cost: \$10 \(2 days\)/i);
  });
});

describe("renderPage", () => {
  it("should return correct content", async () => {
    const result = await renderPage();

    expect(result).toMatch(/content/i);
  });

  it("should call analytics with home page", async () => {
    await renderPage();

    expect(trackPageView).toHaveBeenCalledWith("/home");
  });
});

describe("submitOrder", () => {
  const order = { totalAmount: 10 };
  const creditCard = { creditCardNumber: "1234" };

  it("should charge the customer", async () => {
    // mockResolvedValue not mockReturnValue because charge fun is returning promise
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    await submitOrder(order, creditCard);

    expect(charge).toHaveBeenCalledWith(creditCard, order.totalAmount);
  });

  it("should return success when payment is successful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "success" });

    const result = await submitOrder(order, creditCard);

    // Use toEqual for comparing objects and toBe for values and toMatch for strings
    expect(result).toEqual({ success: true });
  });

  it("should return error when payment is unsuccessful", async () => {
    vi.mocked(charge).mockResolvedValue({ status: "failed" });

    const result = await submitOrder(order, creditCard);

    expect(result).toEqual({ success: false, error: "payment_error" });
  });
});

describe("signUp", () => {
  const email = "name@gmail.com";

  /* To clear all the data of mocks before each assertion :- instead of writing it in each test suite
     we can configure it in vitest.config to automatically clear all mocks before each test
  */
  // beforeEach(() => {
  //   // Clear mock data of one function only
  //   // vi.mocked(sendEmail).mockClear();
  //   // Clear mocks of every function in test suite
  //   vi.clearAllMocks();
  // });

  it("should return false if email is invalid", async () => {
    const result = await signUp("a");

    expect(result).toBe(false);
  });

  it("should return true if email is valid", async () => {
    const result = await signUp(email);

    expect(result).toBe(true);
  });

  it("should send welcome email for valid email", async () => {
    await signUp(email);

    expect(sendEmail).toHaveBeenCalledOnce();
    const args = vi.mocked(sendEmail).mock.calls[0];
    expect(args[0]).toBe(email);
    expect(args[1]).toMatch(/welcome/i);
  });
});

// Spying :- To monitor the behaviour of a function during test execution
describe("login", () => {
  it("should email the one time login code", async () => {
    const email = "name@gmail.com";
    const spy = vi.spyOn(security, "generateCode");

    await login(email);

    const securityCode = spy.mock.results[0].value.toString();
    expect(sendEmail).toHaveBeenCalledWith(email, securityCode);
  });
});

// Mocking Dates :- Always mock external dependecny like APi's curr data/time etc.
describe("isOnline", () => {
  it("should return false if current hour is outside opening hour", () => {
    vi.setSystemTime("2024-09-10 07:59");
    expect(isOnline()).toBe(false);

    vi.setSystemTime("2024-09-10 20:01");
    expect(isOnline()).toBe(false);
  });

  it("should return true if current hour is withing opening hour", () => {
    vi.setSystemTime("2024-09-10 08:00");
    expect(isOnline()).toBe(true);

    vi.setSystemTime("2024-09-10 19:59");
    expect(isOnline()).toBe(true);
  });
});
