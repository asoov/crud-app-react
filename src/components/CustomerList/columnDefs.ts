import { GridColDef } from "@mui/x-data-grid";

export const colDefs: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
  },
  { field: "email", headerName: "Email" },
  { field: "phone", headerName: "Phone" },
];
