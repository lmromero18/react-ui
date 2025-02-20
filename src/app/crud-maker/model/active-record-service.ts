import axios, { AxiosInstance } from "axios";
import { Attribute } from "./attribute";
import { FormInput } from "./input";

interface Pagination {
  total: number;
  current_page: number;
  per_page: number;
}

export class ActiveRecordService<T = any> {
  public api!: AxiosInstance;
  public endpoint?: string;
  public items: Array<T & { id: number | string }> = [];
  public pagination: Pagination = { total: 0, current_page: 1, per_page: 10 };
  public loading = false;
  public urlType?: string;
  public attributes: Attribute[] = [];
  public isShow = false;
  public primaryKey = "id";
  public isNew = true;

  // constructor(endpoint: string, baseURL: string = "/api") {
  //   this.endpoint = endpoint;
  //   this.api = axios.create({ baseURL });
  // }

  constructor() {
    this.initAttributes();
  }

  initAttributes() {
    this.attributes.forEach((attr) => {
      if (attr.input) {
        attr.input.value = attr.input.value || "";
      }
    });
  }

  getFormData() {
    return Object.fromEntries(
      this.attributes.map((attr) => [attr.name, attr.input?.value || ""])
    );
  }

  getUrl(): string {
    let baseUrl: string | undefined;

    switch (this.urlType) {
      case "auth":
        baseUrl = process.env.NEXT_PUBLIC_URL_AUTH;
        return `${baseUrl}/api/v3/${this.getUrl()}`;
      default:
        baseUrl = process.env.NEXT_PUBLIC_URL_API;
        return `${baseUrl}/api/${this.getUrl()}`;
    }
  }

  getAttribute(name: string): Attribute | undefined {
    return this.attributes.find((attr) => attr.name === name);
  }

  // setAttributeValue(name: string, value: any) {
  //   let attr = this.getAttribute(name);

  //   let newValue = value;

  //   if (attr) {
      
  //     if (attr.input) {
  //       attr.input.value = value;
        
  //       if (typeof attr.input.change === "function") {
  //         attr.input.change(value);
  //       }
        
  //       if (typeof attr.input.setter === "function") {
  //         if (![false, null, undefined, "null", "undefined", ""].includes(value)) {
  //           newValue = attr.input.setter(value);
  //         }
  //       }
        
  //       if (typeof attr.input.getter === "function") {
          
  //         if (![false, null, undefined, "null", "undefined", ""].includes(value)) {
  //           newValue = attr.input.getter(value);
  //         }
  //       }

  //       attr.input.value = newValue;

  //     }

  //     attr.rawValue = newValue ;
      
  //   }
  // }

  public creatables() {
    return this.attributes.filter((item: any) => item.creatable && item.input);
  }

  public updatables() {
    return this.attributes.filter((item: any) => item.updatable && item.input);
  }

  public getFormAttributes() {
    /*
    if (all) {
      return this.showable();
    }
    */

    if (this.isNew) {
      return this.creatables();
    }

    return this.updatables();
  }

  public getFormInputs(): FormInput[] {
    return this.getFormAttributes()
      .sort((a, b) => (a.form_order ?? 0) - (b.form_order ?? 0))
      .map((item: any) => item.input);
  }


  public getValues() {
    let result: { [key: string]: any } = {};
    
    for (const input of this.getFormInputs()) {
      if (!input.disabled) {        
        result[input.name] = input.setter ? input.setter(input.value) : input.value;
      }
    }

    return result;
  }

  public getAttributeValue(name: string, value: any) {
    let attr = this.getAttribute(name);
    let input = attr?.input;

    if (attr && input) {
      return input.setter ? input.setter(value) : value;
    }

    return null;
  }

  async findAll(): Promise<void> {
    this.loading = true;
    try {
      const { data } = await this.api.get(`/${this.getUrl()}`);
      this.items = data.data;
      this.pagination = {
        total: data.total,
        current_page: data.current_page,
        per_page: data.per_page,
      };
    } catch (error) {
      console.error("Error fetching records:", error);
    } finally {
      this.loading = false;
    }
  }

  async show(id: any, after?: CallableFunction, err?: CallableFunction): Promise<T | null> {
    this.loading = true;
    try {
      const { data } = await this.api.get(`/${this.getUrl()}/${id}`);

      if (after) {
        after(data);
      }

      return data;
    } catch (error) {
      if (err) {
        err(error);
      }
      return null;
    } finally {
      this.loading = false;
    }
  }

  setEndpoint(endpoint: string): void {
    this.endpoint = endpoint;
  }

  async save(record: Partial<T>): Promise<T | null> {
    if (record[this.primaryKey as keyof T]) {
      return this.update(record[this.primaryKey as keyof T] as any, record);
    } else {
      return this.create(record);
    }
  }

  async create(record: Partial<T>): Promise<T | null> {
    this.loading = true;
    try {
      const { data } = await this.api.post(`/${this.getUrl()}`, record);
      this.items.push(data);
      return data;
    } catch (error) {
      console.error("Error creating record:", error);
      return null;
    } finally {
      this.loading = false;
    }
  }

  async update(id: number | string, record: Partial<T>): Promise<T | null> {
    this.loading = true;
    try {
      const { data } = await this.api.put(`/${this.getUrl()}/${id}`, record);
      this.items = this.items.map((item) => (item["id"] === id ? data : item));
      return data;
    } catch (error) {
      console.error("Error updating record:", error);
      return null;
    } finally {
      this.loading = false;
    }
  }

  async delete(id: number | string): Promise<boolean> {
    this.loading = true;
    try {
      await this.api.delete(`/${this.getUrl()}/${id}`);
      this.items = this.items.filter((item) => item["id"] !== id);
      return true;
    } catch (error) {
      console.error("Error deleting record:", error);
      return false;
    } finally {
      this.loading = false;
    }
  }
}
