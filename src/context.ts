import React from "react";
import { CustomerService } from "./services/CustomerService";

export const AppContext = React.createContext({
  customerService: new CustomerService(import.meta.env.VITE_API_ENDPOINT),
});
