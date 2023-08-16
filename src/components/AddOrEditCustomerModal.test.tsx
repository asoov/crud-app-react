import { render, screen, waitFor } from "@testing-library/react";
import { AddOrEditCustomerModal } from "./AddOrEditCustomerModal";
import { vi } from "vitest";

describe("<AddOrEditCustomerModal />", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    render(<AddOrEditCustomerModal onSubmitHandler={mockOnSubmit} />);
  });

  test("renders the add customer button", () => {
    const addButton = screen.getByTestId(
      "customer-list-add-customer__add-button",
    );
    expect(addButton).toBeInTheDocument();
  });

  test("opens and closes the modal", async () => {
    const addButton = screen.getByTestId(
      "customer-list-add-customer__add-button",
    );
    await user.click(addButton);

    expect(screen.getByText("Add Customer")).toBeInTheDocument();

    await user.click(addButton);
    expect(screen.queryByText("Add Customer")).not.toBeInTheDocument();
  });

  test("submits the form correctly", async () => {
    const addButton = screen.getByTestId(
      "customer-list-add-customer__add-button",
    );
    await user.click(addButton);

    await user.type(screen.getByLabelText("Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "john.doe@example.com");
    await user.type(screen.getByLabelText("Phone"), "123456789");

    await user.click(screen.getByRole("button", { name: /save customer/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john.doe@example.com",
        phone: "123456789",
      });
    });
  });

  test("shows an error when form submission fails", async () => {
    mockOnSubmit.mockRejectedValue(new Error("An error occurred"));

    const addButton = screen.getByTestId(
      "customer-list-add-customer__add-button",
    );
    await user.click(addButton);

    await user.type(screen.getByLabelText("Name"), "John Doe");
    await user.type(screen.getByLabelText("Email"), "john.doe@example.com");
    await user.type(screen.getByLabelText("Phone"), "123456789");

    await user.click(screen.getByRole("button", { name: /save customer/i }));

    await waitFor(() => {
      expect(screen.getByText("An error occurred")).toBeInTheDocument();
    });
  });

  describe("<AddOrEditCustomerModal /> form validation", () => {
    beforeEach(async () => {
      // Open the modal for all tests
      const addButton = screen.getByTestId(
        "customer-list-add-customer__add-button",
      );
      await user.click(addButton);
    });

    test("shows an error for empty name", async () => {
      await user.type(screen.getByLabelText("Name"), "{backspace}");
      await user.click(screen.getByRole("button", { name: /save customer/i }));
      expect(screen.getByText("Name required")).toBeInTheDocument();
    });

    test("shows an error for name less than 5 characters", async () => {
      await user.type(screen.getByLabelText("Name"), "Jon");
      await user.click(screen.getByRole("button", { name: /save customer/i }));

      expect(
        screen.getByText("Name must be at least 5 characters long"),
      ).toBeInTheDocument();
    });

    test("shows an error for empty or invalid email", async () => {
      // For empty email
      await user.type(screen.getByLabelText("Email"), "{backspace}");
      await user.click(screen.getByRole("button", { name: /save customer/i }));
      expect(screen.getByText("Email required")).toBeInTheDocument();

      // For invalid email
      await user.type(screen.getByLabelText("Email"), "johndoe");
      await user.click(screen.getByRole("button", { name: /save customer/i }));
      expect(
        screen.getByText("Entered value does not match email format"),
      ).toBeInTheDocument();
    });

    test("shows an error for empty phone", async () => {
      await user.type(screen.getByLabelText("Phone"), "{backspace}");
      await user.click(screen.getByRole("button", { name: /save customer/i }));
      expect(screen.getByText("Phone number required")).toBeInTheDocument();
    });
  });
});
