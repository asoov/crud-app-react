import {DefaultPageWrapper} from "../wrappers/DefaultPageWrapper";
import {CustomerList} from "../components/CustomerList/CustomerList";

export const Customers: React.FC = () => {
  return (
    <DefaultPageWrapper>
      <CustomerList />
    </DefaultPageWrapper>
  )
}