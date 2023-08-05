import { GridColDef } from "@mui/x-data-grid";

export const colDefs: GridColDef[] = [
  {
    field: "id",
    headerName: "ID",
  },
  {
    field: "name",
    headerName: "Name",
  },
  { field: "email", headerName: "Email" },
  { field: "phone", headerName: "Phone" },
];
