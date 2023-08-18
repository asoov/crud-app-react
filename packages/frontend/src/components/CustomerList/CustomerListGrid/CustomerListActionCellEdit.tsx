import { FC, useContext } from "react";
import { Customer, CustomerActionType } from "@/types/Customer";
import { AppContext } from "@/context";
import { useCustomerState } from "@/hooks/useCustomerState";
import { Edit } from "@mui/icons-material";
import { AddOrEditCustomerModal } from "@/components/AddOrEditCustomerModal";

interface CustomerListActionCellEditProps {
  customer: Customer;
}
export const CustomerListActionCellEdit: FC<
  CustomerListActionCellEditProps
> = ({ customer }) => {
  const { customerService } = useContext(AppContext);
  const { dispatch } = useCustomerState();
  const handleEditCustomer = async (customerChanges: Partial<Customer>) => {
    const newCustomerData = { ...customer, ...customerChanges };
    await customerService.editCustomer(newCustomerData);
    dispatch({
      type: CustomerActionType.EDIT_CUSTOMER,
      payload: newCustomerData,
    });
  };
  return (
    <AddOrEditCustomerModal
      icon={true}
      onSubmitHandler={handleEditCustomer}
      customer={customer}
    >
      <Edit />
    </AddOrEditCustomerModal>
  );
};
