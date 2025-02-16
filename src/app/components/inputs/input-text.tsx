import { useState } from "react";
import { AttributeData, FormInputData } from "@/app/crud-maker/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface InputTextProps {
  data: AttributeData;
}

export function InputText({ data }: InputTextProps) {
  const [inputValue, setInputValue] = useState(data.value || ""); // Estado local si no hay value inicial

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value); // 🔹 Siempre actualiza el estado
    if (data.input?.change) data.input?.change(e); // 🔹 Llama a la función change si existe
  };

  return (
    <div className={`grid w-full max-w-sm items-center gap-1.5 ${data.input?.container_class || ""}`}>
      {data.name && <Label htmlFor={data.name}>{data.name}</Label>}

      <Input
        id={data.name}
        type={data.type || "text"}
        placeholder={data.input?.placeholder || ""}
        required={data.input?.required}
        disabled={data.input?.disabled}
        readOnly={data.input?.readonly}
        className={data.class}
        value={data.value ?? inputValue} // 🔹 Usa data.value si existe, sino usa el estado
        onChange={handleChange}
      />
    </div>
  );
}
