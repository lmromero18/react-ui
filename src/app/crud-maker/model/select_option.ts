import { ActiveRecordService } from "../model/active_record.service";

export class SelectOption {
  constructor(
    public name: any,
    public value: any,
    public model: ActiveRecordService,
    public parentModel: ActiveRecordService,
    public filter?: CallableFunction
  ) {}

  public getName = (item: any) =>
    typeof this.name == "function" ? this.name(item) : item[this.name];

  public getValue = (item: any) =>
    typeof this.value == "function" ? this.value(item) : item[this.value];

  public getOptions = (isForm: boolean = true) =>
    this.filter
      ? //   item, this.parentModel.getFormInputs(), isForm, index
        this.model.items.filter((item, index) => this.model.filter())
      : this.model.items;
}
