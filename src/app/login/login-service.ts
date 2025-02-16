import { ActiveRecordService } from "../crud-maker/model/active-record-service";
import { Attribute } from "../crud-maker/model/attribute";

export class LoginService extends ActiveRecordService {
  public name = "Ingresar";
  public endpoint = "v1/auth/login";
  public primaryKey = "username";

  constructor() {
    super("v1/auth/login", "auth"); // ✅ Llama al constructor de ActiveRecordService
  }

  public attributes: Attribute[] = [
    new Attribute({
      name: "email",
      label: "Usuario",
      type: "string",
      listable: true, // ✅ Valores por defecto para evitar errores
      filtrable: false,
      sortable: true,
      input: {
        type: "email",
        max: 50,
        required: true,
        validations: [(value: string) => value.length > 0 || "El usuario es requerido"],
      },
    }),
    new Attribute({
      name: "password",
      label: "Contraseña",
      type: "string",
      listable: false,
      filtrable: false,
      sortable: false,
      input: {
        type: "password",
        required: true,
        setter: (value: string) => btoa(value), // 🔐 Encriptar con `btoa()`
        validations: [(value: string) => value.length >= 8 || "Mínimo 8 caracteres"],
      },
    }),
  ];
}
