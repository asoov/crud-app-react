import { Customer } from "@/types/Customer";

export class CustomerService {
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  private endpoint: string = "";
  async getCustomers() {
    return await fetch(this.endpoint).then((res) => res.json());
  }
  async addCustomer(customer: Customer) {
    return await fetch(this.endpoint, {
      method: "POST",
      body: JSON.stringify(customer),
    }).then((res) => res.json());
  }

  async editCustomer(customer: Customer) {
    return await fetch(`${this.endpoint}/${customer.id}`, {
      method: "PUT",
      body: JSON.stringify(customer),
    }).then((res) => res.json());
  }
  async deleteCustomer(id: string) {
    return await fetch(`${this.endpoint}/${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
  }
}
