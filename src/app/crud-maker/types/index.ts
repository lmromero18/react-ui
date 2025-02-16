import { SelectOption } from "../model/select_option";

export type AvailableDirectives = "default" | "onlyNumbers";

export type FormInputData = {
  placeholder?: string;
  name?: string;
  type?: string;
  class?: string;
  accept?: string;
  container_class?: string;
  required?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  min?: number;
  max?: number;
  rows?: number;
  validations?: any[];
  validateFilter?: boolean;
  multiple?: boolean;
  options?: SelectOption | SelectOptionsData[];
  change?: (value: any) => void;
  getter?: (value: any) => any;
  setter?: (value: any) => any;
  decimals?: number;
  seconds?: number;
  hourStep?: number;
  minuteStep?: number;
  meridian?: boolean;
  directive?: AvailableDirectives;
  addTag?: boolean;
  dateType?: string;
  data?: any[];
  bindLabel?: string;
  bindValue?: string;
  info?: Info;
  step?: number;
  prefixIcon?: string;
  onRemoveFileCallBack?: (file: any) => void;
  onSuccessCallBack?: (response: any) => void;
  handleUpload?: (file: any) => void;
  groupBy?: string;
  disabledDate?: (date: Date) => boolean;
  nullable?: boolean;
  fileTypes?: string[];
};

export type SelectOptionsData = {
  name: string;
  value: any;
};

export type Info = {
  title: string;
  text: any;
};

export type AttributeData = {
  onRemoveFileCallBack?: (file: any) => void;
  onSuccessCallBack?: (response: any) => void;
  filters?: (item: any) => boolean;
  name: string;
  label: string;
  tag?: string;
  type: string;
  creatable?: boolean;
  updatable?: boolean;
  listable?: boolean;
  filtrable?: boolean;
  list_order?: number;
  form_order?: number;
  filter_order?: number;
  sortable?: boolean;
  sortable_name?: string;
  getter?: (item: any) => any;
  getterOnExport?: boolean;
  getterForExport?: (item: any) => any;
  input?: Partial<FormInputData>; // ✅ Se usa `Partial<FormInputdata>` para mayor flexibilidad
  tooltip?: (item: any) => string;
  class?: string;
  max?: number;
  value?: any;
  width?: string;
};

export interface ActionButton {
  name?: string;
  section?: string;
  text?: (item?: any) => string;
  html?: (item?: any) => any;
  can: (item?: any) => boolean;
  disable?: (item?: any) => boolean;
  icon?: (item?: any) => any;
  class?: (item?: any) => string;
  link?: (item?: any) => string;
  click?: (item?: any) => void;
  tooltip?: (item?: any) => string;
  allowedTypes?: () => string[];
}

export interface Actions {
  [key: string]: ActionButton;
}

export interface Stepper {
  id: (item?: any) => string | number;
  label: string;
  title?: string;
  checked: boolean;
  icon?: string;
  click: (item?: any) => void;
  can: (item?: any) => boolean;
  disabled?: (item?: any) => boolean;
  class?: (item?: any) => string;
  tooltip?: (item?: any) => string;
  html?: (item?: any) => any;
  directory?: boolean;
}
