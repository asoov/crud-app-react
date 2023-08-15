import { render, screen, waitFor } from "@testing-library/react";
import { AppContext, AppContextType } from "@/context";
import { CustomerListActionCellEdit } from "./CustomerListActionCellEdit";
import { FC, ReactNode } from "react";
import { vi } from "vitest";
import { Customer } from "@/types/Customer";
import { AddOrEditCustomerModalProps } from "@/components/AddOrEditCustomerModal";
import { Button } from "@mui/material";

const mockEditCustomer = vi.fn();
const mockDispatch = vi.fn();
vi.mock("@/hooks/useCustomerState", () => ({
  useCustomerState: () => ({
    dispatch: mockDispatch,
  }),
}));
const mockCustomer: Partial<Customer> = {
  id: "123",
  name: "John Doe",
  phone: "017242424",
  email: "email@email.de",
};
const mockCustomerNewData: Partial<Customer> = {
  id: "123",
  name: "John Doe",
  phone: "0172",
  email: "john@john.john",
};
vi.mock("@/components/AddOrEditCustomerModal", () => ({
  AddOrEditCustomerModal: ({
    onSubmitHandler,
  }: AddOrEditCustomerModalProps) => (
    <Button onClick={() => onSubmitHandler(mockCustomerNewData)}>
      Please click me!
    </Button>
  ),
}));

const MockProvider: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AppContext.Provider
      value={
        {
          customerService: { editCustomer: mockEditCustomer },
        } as unknown as AppContextType
      }
    >
      {children}
    </AppContext.Provider>
  );
};

describe("CustomerListActionCellEdit", () => {
  it("sends the updated customer data on edit", async () => {
    render(
      <MockProvider>
        <CustomerListActionCellEdit customer={mockCustomer as Customer} />
      </MockProvider>,
    );

    // Modal functionality is tested in Modal test, that's why I mocked the modal out
    // we're just asserting that the editCustomer function is called with the correct data as we don't want to test the modal functionality here

    await user.click(screen.getByText("Please click me!"));

    await waitFor(() => {
      expect(mockEditCustomer).toHaveBeenCalledWith(mockCustomerNewData);
    });
  });
});
