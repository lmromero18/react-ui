import { FormInput } from "./input";
import { SelectOption } from "./select_option";
import { AttributeData, FormInputData, SelectOptionsData } from "../types";

export class Attribute {
  public name: string;
  public label: string;
  public type: string;
  public max?: number;
  public input?: Partial<FormInput>; // ✅ Permite objetos parciales
  public listable = true;
  public filtrable = false;
  public sortable = true;
  public primaryKey?: boolean;
  public rawValue: any;

  constructor(data: AttributeData) {
    this.name = data.name;
    this.label = data.label;
    this.type = data.type;
    this.max = data.max;
    this.listable = data.listable ?? true;
    this.filtrable = data.filtrable ?? false;
    this.sortable = data.sortable ?? true;
    this.rawValue = data.value;

    if (data.input) {
      this.setInput(data.input);
    }
  }

  private setInput(inputData: FormInputData) {
    this.input = {
      name: inputData.name ?? this.name,
      placeholder: inputData.placeholder ?? this.label,
      type: inputData.type ?? this.getInputType(),
      max: inputData.max ?? this.max,
      required: inputData.required ?? false,
      validations: inputData.validations ?? [],
      validateFilter: inputData.validateFilter ?? false,
      multiple: inputData.multiple ?? false,
      disabled: inputData.disabled ?? false,
      selectOptions: this.normalizeOptions(inputData.options),
    };
  }

  private normalizeOptions(options: SelectOption | SelectOptionsData[] | undefined): SelectOption | undefined {
    if (!options) return undefined;

    if (Array.isArray(options)) {
      return {
        name: "Seleccionar",
        value: "",
        model: options,
        parentModel: [],
        getName: () => "Seleccionar",
        getValue: () => "",
        getOptions: () => options,
      };
    }

    return options;
  }

  private getInputType(): string {
    switch (this.type) {
      case "string":
        return "text";
      case "numeric":
        return "number";
      case "big_string":
        return "textarea";
      default:
        return this.type;
    }
  }

  public set value(data: any) {
    this.rawValue = data;
    if (this.input && "multiple" in this.input && this.input.multiple) {
      this.input.value = (data || []).map(
        (item: any) => item[(this.input?.selectOptions as SelectOption)?.value]
      );
    } else {
      this.input!.value = data;
    }
  }

  public get value() {
    return this.rawValue;
  }
}
