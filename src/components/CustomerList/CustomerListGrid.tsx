import { getCustomers } from "../../resources/customerResource";
import { DataGrid } from "@mui/x-data-grid";
import { colDefs } from "./columnDefs";
import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";
import { CustomerListAddCustomer } from "./CustomerListAddCustomer";

const customersResource = getCustomers();
export const CustomerListGrid: React.FC = () => {
  const [searchInput, setSearchInput] = useState<string>("");
  const customers = customersResource.read();

  const filteredValuesBySearchInput = customers.filter((customer) =>
    customer.name.includes(searchInput),
  );
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
        <CustomerListAddCustomer />
      </Box>
      <DataGrid rows={filteredValuesBySearchInput} columns={colDefs} />
    </div>
  );
};
