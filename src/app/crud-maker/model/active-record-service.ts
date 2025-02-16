import axios, { AxiosInstance } from "axios";
import { Attribute } from "./attribute";

interface Pagination {
  total: number;
  current_page: number;
  per_page: number;
}

export class ActiveRecordService<T = any> {
  private api: AxiosInstance;
  public endpoint?: string;
  public items: Array<T & { id: number | string }> = [];
  public pagination: Pagination = { total: 0, current_page: 1, per_page: 10 };
  public loading = false;
  public urlType?: string;
  public attributes: Attribute[] = [];
  public isShow = false;
  public primaryKey = "id";

  constructor(endpoint: string, baseURL: string = "/api") {
    this.endpoint = endpoint;
    this.api = axios.create({ baseURL });
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

  setAttributeValue(name: string, value: any) {
    let attr = this.attributes.find((item) => item.name === name);
    if (attr) {
      attr.rawValue = value;
      if (attr.input) {
        attr.input.value = value;
      }
    }
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

  async show(id: any, after?:CallableFunction, err?: CallableFunction): Promise<T | null> {
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
