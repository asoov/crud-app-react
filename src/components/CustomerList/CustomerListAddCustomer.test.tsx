import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomerListAddCustomer } from "./CustomerListAddCustomer";
import { AppContext, AppContextType } from "@/context";
import { useCustomerState } from "@/hooks/useCustomerState";
import { CustomerActionType } from "@/types/Customer";
import { Mock, vi } from "vitest";
import { AddOrEditCustomerModalProps } from "@/components/AddOrEditCustomerModal";

// Mock necessary dependencies
vi.mock("@/hooks/useCustomerState");
vi.mock("@/components/AddOrEditCustomerModal", () => ({
  AddOrEditCustomerModal: ({
    onSubmitHandler,
    children,
  }: AddOrEditCustomerModalProps) => (
    <button onClick={() => onSubmitHandler({ id: 123, name: "Test Customer" })}>
      {children}
    </button>
  ),
}));

describe("CustomerListAddCustomer", () => {
  const mockAddCustomerService = vi.fn();
  const mockDispatch = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    (useCustomerState as Mock).mockReturnValue({
      dispatch: mockDispatch,
    });
  });

  it("renders AddOrEditCustomerModal and handles customer addition", async () => {
    const mockContextValue = {
      customerService: {
        addCustomer: mockAddCustomerService,
      },
    };

    render(
      <AppContext.Provider
        value={mockContextValue as unknown as AppContextType}
      >
        <CustomerListAddCustomer />
      </AppContext.Provider>,
    );

    const addButton = screen.getByText("Add Customer");
    expect(addButton).toBeInTheDocument();

    // Using userEvent to click the button
    await userEvent.click(addButton);

    // Ensure the service is called correctly
    expect(mockAddCustomerService).toHaveBeenCalledWith({
      id: 123,
      name: "Test Customer",
    });

    // Ensure the dispatch is called with the correct action
    expect(mockDispatch).toHaveBeenCalledWith({
      type: CustomerActionType.ADD_CUSTOMER,
      payload: { id: 123, name: "Test Customer" },
    });
  });
});
