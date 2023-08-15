import { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { CustomerListActionCell } from "@/components/CustomerList/CustomerListGrid/CustomerListActionCell";

export const colDefs: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
  },
  { field: "email", headerName: "Email" },
  { field: "phone", headerName: "Phone" },
];

export const getColDefs = (): GridColDef[] => [
  ...colDefs,
  {
    field: "delete",
    headerName: "Delete",
    renderCell: (params: GridRenderCellParams) => (
      <CustomerListActionCell params={params} />
    ),
  },
];
