import { render, screen } from "@testing-library/react";
import { CustomerListAddCustomer } from "./CustomerListAddCustomer";

describe("CustomerListAddCustomer", () => {
  beforeEach(() => render(<CustomerListAddCustomer />));

  it("should render name field", () => {
    expect(screen.getByLabelText("Name"));
  });

  it("should render email field", () => {
    expect(screen.getByLabelText("Email"));
  });

  it("should render phone field", () => {
    expect(screen.getByLabelText("Email"));
  });

  describe("validation", () => {});
});
