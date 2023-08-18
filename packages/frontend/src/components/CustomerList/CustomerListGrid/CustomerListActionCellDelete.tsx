import { FC, useContext, useState } from "react";
import { Delete } from "@mui/icons-material";
import { CustomerActionType } from "@/types/Customer";
import { AppContext } from "@/context";
import { useCustomerState } from "@/hooks/useCustomerState";
import { GridRowId } from "@mui/x-data-grid";
import { CircularProgress, IconButton } from "@mui/material";

export const CustomerListActionCellDelete: FC<{ customerId: GridRowId }> = ({
  customerId,
}) => {
  const { customerService } = useContext(AppContext);
  const { dispatch } = useCustomerState();

  const [customerDeleteLoading, setCustomerDeleteLoading] =
    useState<boolean>(false);
  const [customerDeleteError, setCustomerDeleteError] = useState<Error | null>(
    null,
  );
  const handleDeleteCustomer = async (id: string) => {
    try {
      setCustomerDeleteLoading(true);
      await customerService.deleteCustomer(id);
      dispatch({ type: CustomerActionType.DELETE_CUSTOMER, payload: id });
    } catch (error) {
      setCustomerDeleteError(error as Error);
    } finally {
      setCustomerDeleteLoading(false);
    }
  };
  return (
    <IconButton
      data-testid="customer-list-grid-delete-button"
      color={customerDeleteError ? "error" : "primary"}
      onClick={() => handleDeleteCustomer(customerId as string)}
    >
      {customerDeleteLoading ? <CircularProgress size={16} /> : <Delete />}
    </IconButton>
  );
};
