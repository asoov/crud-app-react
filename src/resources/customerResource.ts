import {wrapPromise} from "../helpers/wrapPromise";

export const getCustomers = () => {
  const promise = fetch('https://jsonplaceholder.typicode.com/users').then(res => res.json())
  return wrapPromise(promise)
}