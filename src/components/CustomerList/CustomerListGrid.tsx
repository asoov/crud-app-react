import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { colDefs } from "./columnDefs";
import { Box, Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { CustomerListAddCustomer } from "./CustomerListAddCustomer";
import { Customer } from "../../types/Customer";
import { AppContext } from "../../context";

interface CustomerListGridProps {
  customers: Customer[];
}
export const CustomerListGrid: React.FC<CustomerListGridProps> = ({
  customers,
}) => {
  const [searchInput, setSearchInput] = useState<string>("");

  // TODO: this should be persisted in storage
  const [displayedCustomers, setDisplayedCustomers] =
    useState<Customer[]>(customers);
  const filteredValuesBySearchInput = displayedCustomers.filter((customer) =>
    customer.name.includes(searchInput),
  );

  const { customerService } = useContext(AppContext);

  const handleAddCustomer = async (customer: Customer) => {
    try {
      await customerService.addCustomer(customer);
      setDisplayedCustomers([
        ...displayedCustomers,
        { ...customer, id: (displayedCustomers.length + 1).toString() },
      ]);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    try {
      await customerService.deleteCustomer(id);
      setDisplayedCustomers(
        displayedCustomers.filter((customer) => customer.id !== id),
      );
    } catch (error) {
      console.error(error);
    }
  };

  const colDefsWithInteractiveElements: GridColDef[] = [
    ...colDefs,
    {
      field: "delete",
      headerName: "Delete",
      renderCell: (params: GridRenderCellParams) => (
        <Button onClick={() => handleDeleteCustomer(params.id as string)}>
          Delete
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Box sx={{ marginBottom: "16px" }}>
        <TextField
          value={searchInput}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
            setSearchInput(event.target.value)
          }
          fullWidth={true}
          id="outlined-basic"
          label="Search for customer name"
          variant="outlined"
        />
        <CustomerListAddCustomer addCustomer={handleAddCustomer} />
      </Box>
      <DataGrid
        rows={filteredValuesBySearchInput}
        columns={colDefsWithInteractiveElements}
      />
    </div>
  );
};
