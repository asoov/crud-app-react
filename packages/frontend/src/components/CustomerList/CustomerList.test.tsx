import { render, screen } from "@testing-library/react";
import { CustomerList } from "./CustomerList";
import { AppContext } from "@/context";

import { beforeEach, describe, expect, it, vi } from "vitest";
import { CustomerService } from "@/services/CustomerService";

// Mock out child components
vi.mock("./CustomerListGrid/CustomerListGrid", () => ({
  CustomerListGrid: () => <div data-testid="customer-list-grid">Grid</div>,
}));
vi.mock("@/components/CustomerList/CustomerListLoading", () => ({
  CustomerListLoading: () => <div data-testid="loading">Loading...</div>,
}));
vi.mock("@/components/CustomerList/CustomerListError", () => ({
  CustomerListError: () => <div data-testid="error">Error</div>,
}));

describe("CustomerList", () => {
  const mockGetCustomers = vi.fn();

  const mockContextValue = {
    customerService: {
      getCustomers: mockGetCustomers,
    } as unknown as CustomerService,
  };

  beforeEach(() => {
    mockGetCustomers.mockReset();
  });

  it("renders the loading state initially", () => {
    mockGetCustomers.mockReturnValue(new Promise(() => {}));

    render(
      <AppContext.Provider value={mockContextValue}>
        <CustomerList />
      </AppContext.Provider>,
    );

    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });

  it("renders the customer grid on successful fetch", async () => {
    mockGetCustomers.mockResolvedValue([]);

    render(
      <AppContext.Provider value={mockContextValue}>
        <CustomerList />
      </AppContext.Provider>,
    );

    expect(await screen.findByTestId("customer-list-grid")).toBeInTheDocument();
  });

  it("renders the error component on fetch failure", async () => {
    mockGetCustomers.mockRejectedValue(new Error("Fetch failed"));

    render(
      <AppContext.Provider value={mockContextValue}>
        <CustomerList />
      </AppContext.Provider>,
    );

    expect(await screen.findByTestId("error")).toBeInTheDocument();
  });
});
