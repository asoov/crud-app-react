import { FC, useContext } from "react";
import { Customer, CustomerActionType } from "@/types/Customer";
import { AddOrEditCustomerModal } from "@/components/AddOrEditCustomerModal";
import { AppContext } from "@/context";
import { useCustomerState } from "@/hooks/useCustomerState";

export const CustomerListAddCustomer: FC = () => {
  const { customerService } = useContext(AppContext);
  const { dispatch } = useCustomerState();

  const handleAddCustomer = async (customer: Customer) => {
    await customerService.addCustomer(customer);
    dispatch({
      type: CustomerActionType.ADD_CUSTOMER,
      payload: customer,
    });
  };

  return (
    <AddOrEditCustomerModal onSubmitHandler={handleAddCustomer}>
      Add Customer
    </AddOrEditCustomerModal>
  );
};
