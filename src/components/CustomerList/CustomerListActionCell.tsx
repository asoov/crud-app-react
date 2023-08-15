import { FC } from "react";
import { GridRenderCellParams } from "@mui/x-data-grid";
import { CustomerListActionCellDelete } from "@/components/CustomerList/CustomerListActionCellDelete";
import { CustomerListActionCellEdit } from "@/components/CustomerList/CustomerListActionCellEdit";

export const CustomerListActionCell: FC<{ params: GridRenderCellParams }> = ({
  params,
}) => {
  console.log(params);
  return (
    <>
      <CustomerListActionCellDelete customerId={params.id} />
      <CustomerListActionCellEdit customer={params.row} />
    </>
  );
};
