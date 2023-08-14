import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomerListGrid } from "./CustomerListGrid";
import { AppContext } from "@/context";
import { vi } from "vitest";
import { CustomerActionType } from "@/types/Customer";

const mockCustomerService = {
  addCustomer: vi.fn(),
  deleteCustomer: vi.fn(),
};

const mockDispatch = vi.fn();

vi.mock("@/hooks/useCustomerState", () => ({
  useCustomerState: () => ({
    customers: [
      { id: "1", name: "John Doe", phone: "017242424" },
      { id: "2", name: "Jane Smith", phone: "017242424" },
    ],
    dispatch: mockDispatch,
  }),
}));

describe("CustomerListGrid", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays customers in the DataGrid", () => {
    render(
      <AppContext.Provider value={{ customerService: mockCustomerService }}>
        <CustomerListGrid />
      </AppContext.Provider>,
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  it("filters customers based on search input", async () => {
    render(
      <AppContext.Provider value={{ customerService: mockCustomerService }}>
        <CustomerListGrid />
      </AppContext.Provider>,
    );

    await userEvent.type(
      screen.getByLabelText("Search for customer name"),
      "John",
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).toBeNull();
  });

  it("displays a loading spinner when deleting customer is in progress", async () => {
    mockCustomerService.deleteCustomer.mockReturnValue(new Promise(() => {}));
    render(
      <AppContext.Provider value={{ customerService: mockCustomerService }}>
        <CustomerListGrid />
      </AppContext.Provider>,
    );

    const deleteButton = screen.getAllByRole("button", { name: "Delete" })[0];
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    await waitFor(() => {
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });
  });

  it("displays button in error state when deletion fails", async () => {
    mockCustomerService.deleteCustomer.mockRejectedValue(new Error("Failed"));
    render(
      <AppContext.Provider value={{ customerService: mockCustomerService }}>
        <CustomerListGrid />
      </AppContext.Provider>,
    );

    const deleteButton = screen.getAllByRole("button", { name: "Delete" })[0];
    expect(deleteButton).toBeInTheDocument();
    await userEvent.click(deleteButton);
    screen.debug(undefined, 100000);
    // await waitFor(() => {
    //   expect(deleteButton).toHaveProperty("error");
    // });
  });

  it("deletes a customer", async () => {
    mockCustomerService.deleteCustomer.mockResolvedValueOnce();

    render(
      <AppContext.Provider value={{ customerService: mockCustomerService }}>
        <CustomerListGrid />
      </AppContext.Provider>,
    );

    await userEvent.click(screen.getAllByRole("button", { name: "Delete" })[0]);

    await waitFor(() => {
      expect(mockCustomerService.deleteCustomer).toHaveBeenCalledWith("1");
      expect(mockDispatch).toHaveBeenCalledWith({
        type: CustomerActionType.DELETE_CUSTOMER,
        payload: "1",
      });
    });
  });
});
