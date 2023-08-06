import { useContext, useEffect, useState } from "react";
import { CustomerListGrid } from "./CustomerListGrid";
import { AppContext } from "../../context";

export const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | undefined>(undefined);
  const { customerService } = useContext(AppContext);
  useEffect(() => {
    setLoading(true);
    customerService
      .getCustomers()
      .then((customers) => setCustomers(customers))
      .catch((error) => setError(error))
      .finally(() => setLoading(false));
  }, []);
  return (
    <>
      {loading && <CustomerListLoading />}
      {error && <CustomerLoadingError />}
      {!loading && !error && <CustomerListGrid customers={customers} />}
    </>
  );
};

const CustomerListLoading: React.FC = () => {
  return <div>Loading customers...</div>;
};

const CustomerLoadingError: React.FC = () => {
  return <div>Failed to load customers</div>;
};
