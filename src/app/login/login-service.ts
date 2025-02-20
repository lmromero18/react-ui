import { ActiveRecordService } from "../crud-maker/model/active-record-service";
import { Attribute } from "../crud-maker/model/attribute";

export class LoginService extends ActiveRecordService {
  public name = "Ingresar";
  public override endpoint = "v1/auth/login";
  public override primaryKey = "username";

  public override attributes: Attribute[] = [
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
        validations: [(value: string) => value?.length > 0 || "El usuario es requerido"],
        // change: (value: string) => {
        //   console.log("📝 Cambiando email:", value);
          
        // }
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
        validations: [(value: string) => value?.length >= 8 || "Mínimo 8 caracteres"],
      },
    }),
  ];
}
