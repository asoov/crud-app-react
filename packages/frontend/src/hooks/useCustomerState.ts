import { Dispatch, useContext } from "react";
import { CustomerContext } from "@/context";
import { Customer } from "@/types/Customer";
import { CustomerAction } from "@/types/Customer";

export const useCustomerState = (): {
  customers: Customer[];
  dispatch: Dispatch<CustomerAction>;
} => {
  const context = useContext(CustomerContext);

  if (!context) {
    throw new Error("useCustomerState must be used within a CustomerProvider");
  }
  return context;
};
