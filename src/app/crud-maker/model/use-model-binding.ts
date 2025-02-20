import { useState, useEffect, use } from "react";
import { ActiveRecordService } from "../model/active-record-service";
import { useControllerComponent } from "../hooks/controller";

export function useModelBinding<T extends ActiveRecordService<any>>(initialModel: T) {
  const [formData, setFormData] = useState(() => initialModel.getFormData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [model, setModel] = useState<T>(initialModel);
  const [values, setValues] = useState<any>(model.getValues());
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // 🔄 Sincroniza `formData` con el modelo solo en la primera carga
  // useEffect(() => {
  //   model.attributes.forEach((attr) => {
  //     model.setAttributeValue(attr.name, attr.value);
  //   });
  // }, []);

  // 🔍 Valida el formulario cada vez que `formData` cambia
  useEffect(() => {
    const newErrors: { [key: string]: string } = {};
    model.attributes.forEach((attr) => {
      const value = formData[attr.name];

      attr.input?.validations?.forEach((validationFn) => {
        const result = validationFn(value);
        if (result !== true) {
          newErrors[attr.name] = typeof result === "string" ? result : "Valor inválido";
        }
      });
    });

    setErrors(newErrors);
  }, [formData]);

  // 🛠 Captura valores autocompletados por el navegador
  useEffect(() => {
    const interval = setInterval(() => {
      model.attributes.forEach((attr) => {
        const inputElement = document.getElementById(attr.name) as HTMLInputElement;
        if (inputElement && inputElement.value !== formData[attr.name]) {
          handleChange(attr.name, inputElement.value);
        }
      });
    }, 500); // 🔹 Comprueba cada 500ms si los valores han cambiado

    return () => clearInterval(interval); // ✅ Limpia el intervalo al desmontar
  }, [formData]);

  // 📝 Actualiza el valor de un campo del formulario
  useEffect(() => {
    setValues(model.getValues());
  }, [formData]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setModel((prev) => {
      const attr = prev.getAttribute(name);
      if (attr) {
        attr.value = model.getAttributeValue(name, value);
      }
      return prev;
    });
    setTouched((prev) => ({ ...prev, [name]: true }));

  };

  // ✅ Devuelve `true` si no hay errores en el formulario
  const isValid = Object.keys(errors).length === 0;

  return { formData, handleChange, model, errors, isValid, values, touched, setTouched };
}
