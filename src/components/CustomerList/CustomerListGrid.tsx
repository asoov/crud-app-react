import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { colDefs } from "./columnDefs";
import { Box, TextField } from "@mui/material";
import { ChangeEvent, FC, useContext, useState } from "react";
import { CustomerListAddCustomer } from "./CustomerListAddCustomer";
import {
  Customer,
  CustomerDeleteError,
  CustomerDeleteLoading,
} from "@/types/Customer";
import { useCustomerState } from "@/hooks/useCustomerState";
import { CustomerActionType } from "@/types/Customer";
import { LoadingButton } from "@mui/lab";
import { AppContext } from "@/context";
import { Error } from "@mui/icons-material";

export const CustomerListGrid: FC = () => {
  const { customerService } = useContext(AppContext);

  const [searchInput, setSearchInput] = useState<string>("");
  const [customerAddLoading, setCustomerAddLoading] = useState<boolean>(false);
  const [customerAddError, setCustomerAddError] = useState<Error | null>(null);

  const [customerDeleteLoading, setCustomerDeleteLoading] =
    useState<CustomerDeleteLoading | null>(null);
  const [customerDeleteError, setCustomerDeleteError] =
    useState<CustomerDeleteError | null>(null);

  const { customers, dispatch } = useCustomerState();

  const filteredValuesBySearchInput = customers.filter((customer) =>
    customer.name.includes(searchInput),
  );

  const handleAddCustomer = async (customer: Customer) => {
    try {
      setCustomerAddLoading(true);
      await customerService.addCustomer(customer);
      dispatch({
        type: CustomerActionType.ADD_CUSTOMER,
        payload: customer,
      });
    } catch (error: unknown) {
      setCustomerAddError(error as Error);
    } finally {
      setCustomerAddLoading(false);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      setCustomerDeleteLoading({ id, loading: true });
      await customerService.deleteCustomer(id);
      dispatch({ type: CustomerActionType.DELETE_CUSTOMER, payload: id });
    } catch (error) {
      setCustomerDeleteError({ id, error } as CustomerDeleteError);
    } finally {
      setCustomerDeleteLoading(null);
    }
  };

  const colDefsWithInteractiveElements: GridColDef[] = [
    ...colDefs,
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params: GridRenderCellParams) => (
        <LoadingButton
          data-test-id="customer-list-grid-delete-button"
          loading={customerDeleteLoading?.id === params.id}
          color={customerDeleteError?.id === params.id ? "error" : "primary"}
          onClick={() => handleDeleteCustomer(params.id as string)}
        >
          {customerDeleteError?.id === params.id && (
            <Error sx={{ marginRight: "8px" }} />
          )}
          Delete
        </LoadingButton>
      ),
    },
  ];

  return (
    <div>
      <Box
        display="flex"
        flexDirection="column"
        gap={2}
        sx={{ marginBottom: "16px" }}
      >
        <TextField
          value={searchInput}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            setSearchInput(event.target.value)
          }
          error={Boolean(customerAddError)}
          fullWidth={true}
          id="outlined-basic"
          label="Search for customer name"
          variant="outlined"
        />
        <CustomerListAddCustomer
          customerAdd={handleAddCustomer}
          customerAddError={customerAddError}
          customerAddLoading={customerAddLoading}
        />
      </Box>
      <DataGrid
        rows={filteredValuesBySearchInput}
        columns={colDefsWithInteractiveElements}
        columnBuffer={5}
      />
    </div>
  );
};
