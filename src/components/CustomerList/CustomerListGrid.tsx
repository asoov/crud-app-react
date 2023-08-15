import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { getColDefs } from "./columnDefs";
import { Box, TextField } from "@mui/material";
import { ChangeEvent, FC, useMemo, useState } from "react";
import { useCustomerState } from "@/hooks/useCustomerState";
import { CustomerListAddCustomer } from "@/components/CustomerList/CustomerListAddCustomer";

export const CustomerListGrid: FC = () => {
  const [searchInput, setSearchInput] = useState<string>("");

  const { customers } = useCustomerState();

  const filteredValuesBySearchInput = customers.filter((customer) =>
    customer.name.includes(searchInput),
  );

  const colDefsWithInteractiveElements: GridColDef[] = useMemo(
    () => getColDefs(),
    [],
  );

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
          fullWidth={true}
          id="outlined-basic"
          label="Search for customer name"
          variant="outlined"
        />
        <CustomerListAddCustomer />
      </Box>
      <DataGrid
        rows={filteredValuesBySearchInput}
        columns={colDefsWithInteractiveElements}
        columnBuffer={5}
      />
    </div>
  );
};
