import { v4 as uuidv4 } from "uuid";
import {
  CustomerAction,
  CustomerActionType,
  CustomerState,
} from "@/types/Customer";

export const customerReducer = (
  state: CustomerState,
  action: CustomerAction,
): CustomerState => {
  switch (action.type) {
    case CustomerActionType.SET_CUSTOMERS:
      return { ...state, customers: action.payload };
    case CustomerActionType.ADD_CUSTOMER:
      return {
        ...state,
        customers: [...state.customers, { ...action.payload, id: uuidv4() }],
      };
    case CustomerActionType.DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(
          (customer) => customer.id !== action.payload,
        ),
      };
    case CustomerActionType.SET_LOADING:
      return { ...state, loading: action.payload };
    case CustomerActionType.SET_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};
