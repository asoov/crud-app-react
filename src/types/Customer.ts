export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export interface CustomerState {
  customers: Customer[];
  loading: boolean;
  error: Error | null;
}

export type CustomerAction =
  | CustomerSetCustomersAction
  | CustomerAddAction
  | CustomerDeleteAction
  | CustomerSetLoadingAction
  | CustomerSetErrorAction;

interface CustomerSetCustomersAction {
  type: CustomerActionType.SET_CUSTOMERS;
  payload: Customer[];
}
interface CustomerAddAction {
  type: CustomerActionType.ADD_CUSTOMER;
  payload: Customer;
}

interface CustomerDeleteAction {
  type: CustomerActionType.DELETE_CUSTOMER;
  payload: string;
}

interface CustomerSetLoadingAction {
  type: CustomerActionType.SET_LOADING;
  payload: boolean;
}

interface CustomerSetErrorAction {
  type: CustomerActionType.SET_ERROR;
  payload: Error | null;
}

export enum CustomerActionType {
  SET_CUSTOMERS = "SET_CUSTOMERS",
  ADD_CUSTOMER = "ADD_CUSTOMER",
  DELETE_CUSTOMER = "DELETE_CUSTOMER",
  SET_LOADING = "SET_LOADING",
  SET_ERROR = "SET_ERROR",
}

export type CustomerDeleteError = {
  id: string;
  error: Error;
};

export type CustomerDeleteLoading = {
  id: string;
  loading: boolean;
};
