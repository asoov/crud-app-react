import { FC } from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { CustomerListActionCellDelete } from "@/components/CustomerList/CustomerListGrid/CustomerListActionCellDelete";
import { CustomerListActionCellEdit } from "@/components/CustomerList/CustomerListGrid/CustomerListActionCellEdit";

export const CustomerListActionCell: FC<{ params: GridRenderCellParams }> = ({
  params,
}) => {
  return (
    <>
      <CustomerListActionCellDelete customerId={params.id} />
      <CustomerListActionCellEdit customer={params.row} />
    </>
  );
};
