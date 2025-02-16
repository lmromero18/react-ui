export class IInput {
    public placeholder: string;
    public name: string;
    public type: string;
    public class: string;
    public disable: boolean;
    public readonly: boolean;
    public min: number;
    public max: number;
    public value: any;
    public select: any;
    public multiple: boolean;
    // public options!: SelectOption;
    // public selectOptions!: SelectOption | SelectOptionsData[];
  
    constructor(options: any) {
      this.placeholder = options.placeholder;
      this.name = options.name;
      this.type = options.type;
      this.class = options.class;
      this.disable = options.disable;
      this.readonly = options.readonly;
      this.min = options.min;
      this.max = options.max;
      this.value = options.value ? options.value : "";
      this.multiple = options.multiple;
    //   if (options.options) {
    //     this.options = options.options;
    //   }
    }
  
    // public getOptions() {
    //   return this.options.getOptions()?.map((item: any) => ({
    //     name: this.options.getName(item),
    //     value: this.options.getValue(item),
    //   }));
    // }
    // public setOptions(options: SelectOption | SelectOptionsData[]): void {
    //   this.selectOptions = options;
    // }
  }