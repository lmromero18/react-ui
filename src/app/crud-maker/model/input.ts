import { useState } from "react";
import { SelectOptionsData } from "../types";
import { SelectOption } from "./select_option";

export class FormInput {
  public placeholder?: string;
  public name!: string;
  public type: string = "text";
  public class?: string;
  public accept?: string;
  public container_class?: string;
  public required?: boolean = false;
  public disabled?: boolean = false;
  public readonly?: boolean = false;
  public min?: number;
  public max?: number;
  public multiple?: boolean;
  public step?: number = 0;
  public selectOptions!: SelectOption | SelectOptionsData[];
  public validations?: ((value: any) => boolean | string)[] = [];
  public validateFilter: boolean = false;
  public change?: (value: any) => void;
  public getter?: (value: any) => any;
  public setter?: (value: any) => any;
  public form_order!: number;

  private _value: any;
  private setValue!: (value: any) => void;

  constructor(initialValue: any = "") {
    const [value, updateValue] = useState(initialValue);
    this._value = value;
    this.setValue = updateValue;
  }

  public get value() {
    return this._value;
  }

  public set value(data: any) {
    this.initValue(data);
    if (this.change) this.change(data);
    if (this.setter) data = this.setter(data);
    this._value = data;
  }

  public initValue(data: any) {
    if ([false, null, undefined, "null", "undefined", ""].includes(data)) {
      data = null;
    }

    if (this.getter) {
      data = this.getter(data);
    }

    this._value = data;
    this.setValue(data);
  }

  public getName(): string {
    return this.name;
  }
}
