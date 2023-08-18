import { render, screen, act } from "@testing-library/react";
import { AppContext, AppContextType } from "@/context";
import { CustomerListActionCellDelete } from "./CustomerListActionCellDelete";
import { FC, ReactNode } from "react";
import { vi } from "vitest";
import { CustomerActionType } from "@/types/Customer";

// Mock context and customerService for the test
const mockDeleteCustomer = vi.fn();
const mockDispatch = vi.fn();
vi.mock("@/hooks/useCustomerState", () => ({
  useCustomerState: () => ({
    dispatch: mockDispatch,
  }),
}));

const MockProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AppContext.Provider
      value={
        {
          customerService: { deleteCustomer: mockDeleteCustomer },
        } as unknown as AppContextType
      }
    >
      {children}
    </AppContext.Provider>
  );
};

describe("CustomerListActionCellDelete", () => {
  it("deletes a customer when the delete button is clicked", async () => {
    render(
      <MockProvider>
        <CustomerListActionCellDelete customerId="123" />
      </MockProvider>,
    );

    const deleteButton = screen.getByTestId("customer-list-grid-delete-button");

    // Click the delete button
    await user.click(deleteButton);

    expect(mockDeleteCustomer).toHaveBeenCalledWith("123");
    expect(mockDispatch).toHaveBeenCalledWith({
      type: CustomerActionType.DELETE_CUSTOMER,
      payload: "123",
    });
  });

  it("shows a CircularProgress while deleting", async () => {
    // Make the deleteCustomer function take some time to simulate a network request
    mockDeleteCustomer.mockImplementation(
      () => new Promise((res) => setTimeout(res, 1000)),
    );

    render(
      <MockProvider>
        <CustomerListActionCellDelete customerId="123" />
      </MockProvider>,
    );

    const deleteButton = screen.getByTestId("customer-list-grid-delete-button");

    // Click the delete button
    await user.click(deleteButton);

    // Check for CircularProgress
    expect(screen.getByRole("progressbar")).toBeInTheDocument();

    await act(() => new Promise((res) => setTimeout(res, 1000)));

    // After the async operation completes, CircularProgress should no longer be in the document
    expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
  });
});
