import { Suspense } from "react";
import { CustomerListGrid } from "./CustomerListGrid";

export const CustomerList: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<CustomerLoadingError />}>
        <CustomerListGrid />
      </Suspense>
    </div>
  );
};

const CustomerLoadingError: React.FC = () => {
  return <div>Failed to load customers</div>;
};
