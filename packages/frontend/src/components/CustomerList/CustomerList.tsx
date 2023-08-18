import { FC, useCallback, useContext, useEffect, useReducer } from "react";
import { CustomerListGrid } from "./CustomerListGrid/CustomerListGrid";
import { AppContext, CustomerContext } from "@/context";
import { customerReducer } from "@/reducers/customersReducer";
import { CustomerActionType } from "@/types/Customer";
import { CustomerListLoading } from "@/components/CustomerList/CustomerListLoading";
import { CustomerListError } from "@/components/CustomerList/CustomerListError";

export const CustomerList: FC = () => {
  const { customerService } = useContext(AppContext);
  const [{ customers, loading, error }, dispatch] = useReducer(
    customerReducer,
    { customers: [], loading: true, error: null },
  );
  const fetchCustomers = useCallback(async () => {
    try {
      dispatch({ type: CustomerActionType.SET_LOADING, payload: true });
      const customers = await customerService.getCustomers();
      dispatch({ type: CustomerActionType.SET_CUSTOMERS, payload: customers });
    } catch (error: unknown) {
      dispatch({ type: CustomerActionType.SET_ERROR, payload: error as Error });
    } finally {
      dispatch({ type: CustomerActionType.SET_LOADING, payload: false });
    }
  }, [customerService]);

  useEffect(() => {
    fetchCustomers().catch((error) => console.error(error));
  }, [fetchCustomers]);

  return (
    <CustomerContext.Provider value={{ customers, dispatch }}>
      {loading && <CustomerListLoading />}
      {error && <CustomerListError />}
      {!loading && !error && <CustomerListGrid />}
    </CustomerContext.Provider>
  );
};
