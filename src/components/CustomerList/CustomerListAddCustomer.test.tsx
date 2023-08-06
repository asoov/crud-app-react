import { render, screen, waitFor } from "@testing-library/react";
import { CustomerListAddCustomer } from "./CustomerListAddCustomer";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

//TODO: Open Modal on click to make tests pass
describe("CustomerListAddCustomer", () => {
  const mockAddCustomer = vi.fn();
  beforeEach(() => {
    render(<CustomerListAddCustomer addCustomer={mockAddCustomer} />);
    userEvent.click(screen.getByText("Add Customer"));
  });

  it.only("should render name field", () => {
    screen.debug();
    expect(screen.findByLabelText("Name")).toBeInTheDocument();
  });

  it("should render email field", () => {
    expect(screen.findByLabelText("Email")).toBeInTheDocument();
  });

  it("should render phone field", () => {
    expect(screen.findByLabelText("Email")).toBeInTheDocument();
  });

  describe("validation", () => {
    describe("empty state", () => {
      beforeEach(async () => {
        const button = await screen.findByText("Save Customer");
        await waitFor(() => user.click(button));
      });
      it("should show name required error", () => {
        expect(screen.findByText("Name required")).toBeInTheDocument();
      });
      it("should show email required error", () => {
        expect(screen.findByText("Name required")).toBeInTheDocument();
      });
      it("should show phone required error", () => {
        expect(screen.findByText("Phone number required")).toBeInTheDocument();
      });
    });
    describe("invalid email", () => {
      beforeEach(async () => {
        user.type(await screen.findByLabelText("Email"), "invalid email");
        const button = await screen.findByText("Save Customer");
        await waitFor(() => user.click(button));
      });
      it("should show invalid email error", () => {
        expect(
          screen.findByText("Entered value does not match email format"),
        ).toBeInTheDocument();
      });
    });
    describe("invalid name", () => {
      beforeEach(async () => {
        user.type(await screen.findByLabelText("Name"), "a");
        const button = await screen.findByText("Save Customer");
        await waitFor(() => user.click(button));
      });
      it("should show invalid name error", () => {
        expect(
          screen.findByText("Name must be at least 5 characters"),
        ).toBeInTheDocument();
      });
    });
  });
});
