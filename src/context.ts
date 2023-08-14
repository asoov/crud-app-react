import React, { Dispatch } from "react";
import { CustomerService } from "@/services/CustomerService";
import { Customer } from "@/types/Customer";
import { CustomerAction } from "@/reducers/customersReducer";

export const AppContext = React.createContext({
  customerService: new CustomerService(import.meta.env.VITE_API_ENDPOINT),
});

export type CustomerContextType = {
  customers: Customer[];
  dispatch: Dispatch<CustomerAction>;
};
export const CustomerContext = React.createContext<CustomerContextType | null>(
  null,
);
