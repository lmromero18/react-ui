import { useState } from "react";
import { FormInputData, SelectOptionsData } from "../types";
import { SelectOption } from "./select_option";

export function useFormControl(initialValue: any) {
  const [value, setValue] = useState(initialValue);

  const updateValue = (newValue: any) => {
    setValue(newValue);
  };

  return { value, setValue: updateValue };
}

export class FormInput {
  public placeholder?: string;
  public name?: string;
  public type: any;
  public class?: string;
  public accept?: string;
  public container_class?: string;
  public required?: boolean = false;
  public disabled?: boolean = false;
  public readonly?: boolean = false;
  public min?: number;
  public max?: number;
  public rawValue?: any;
  public multiple?: boolean;
  public selectOptions!: SelectOption | SelectOptionsData[];
  public validations?: ((value: any) => boolean | string)[] = [];
  public validateFilter:boolean = false;
  public change?: (value: any) => void;
  public getter?: (value: any) => any;
  public setter?: (value: any) => any;
  public step?: number = 0;
  public formControl: ReturnType<typeof useFormControl>;

  constructor(data: FormInputData) {
    Object.assign(this, data);

    // ✅ Inicializa el formControl con `useState`
    this.formControl = useFormControl(this.value ?? "");
  }

  public set value(data: any) {
    this.initValue(data);

    if (this.change) {
      this.change(data);
    }
  }

  public get value() {
    return this.formControl.value;
  }

  public initValue(data: any) {
    if ([false, null, undefined, "null", "undefined", ""].includes(data)) {
      data = null;
    }

    this.rawValue = data;

    if (this.getter) {
      data = this.getter(data);
    }

    this.formControl.setValue(data);
  }
}
