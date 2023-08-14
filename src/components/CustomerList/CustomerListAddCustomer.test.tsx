import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CustomerListAddCustomer } from "./CustomerListAddCustomer";
import { vi } from "vitest";
import { Customer } from "@/types/Customer";

describe("CustomerListAddCustomer", () => {
  let mockCustomerAdd: (data: Customer) => Promise<void>;

  beforeEach(() => {
    mockCustomerAdd = vi.fn(() => Promise.resolve());
  });

  it("opens and closes the modal", async () => {
    render(
      <CustomerListAddCustomer
        customerAdd={mockCustomerAdd}
        customerAddLoading={false}
        customerAddError={null}
      />,
    );

    // Modal should be initially closed
    expect(screen.queryByTestId("form")).not.toBeInTheDocument();

    // Open the modal
    await userEvent.click(screen.getByText("Add Customer"));
    await waitFor(() => {
      expect(screen.getByLabelText("Name")).toBeInTheDocument();
    });

    // Close the modal
    await userEvent.click(
      screen.getByTestId("customer-list-add-customer__add-button"),
    );
    await waitFor(() => {
      expect(screen.queryByLabelText("Name")).not.toBeInTheDocument();
    });
  });

  it("submits the form and triggers customerAdd", async () => {
    render(
      <CustomerListAddCustomer
        customerAdd={mockCustomerAdd}
        customerAddLoading={false}
        customerAddError={null}
      />,
    );

    // Open the modal
    await userEvent.click(screen.getByText("Add Customer"));

    // Fill the form
    await userEvent.type(screen.getByLabelText("Name"), "Test Name");
    await userEvent.type(screen.getByLabelText("Email"), "test@email.com");
    await userEvent.type(screen.getByLabelText("Phone"), "1234567890");

    // Submit the form
    await userEvent.click(screen.getByText("Save Customer"));

    await waitFor(() => {
      expect(mockCustomerAdd).toHaveBeenCalledWith({
        name: "Test Name",
        email: "test@email.com",
        phone: "1234567890",
      });
    });
  });
});
