import { useState, useEffect } from "react";
import { ActiveRecordService } from "../model/active-record-service";

export function useModelBinding<T extends ActiveRecordService<any>>(model: T) {
  const [formData, setFormData] = useState(() => {
    // Inicializa los valores con los atributos del modelo
    const initialData: { [key: string]: any } = {};
    model.attributes.forEach((attr) => {
      initialData[attr.name] = attr.input?.value || "";
    });
    return initialData;
  });

  useEffect(() => {
    model.attributes.forEach((attr) => {
      if (attr.input) {
        attr.input.value = formData[attr.name]; // ✅ Mantener sincronizado
      }
    });
  }, [formData]);

  const handleChange = (name: string, value: any) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    model.setAttributeValue(name, value); // ✅ Actualiza directamente en el modelo
  };

  return { formData, handleChange };
}
