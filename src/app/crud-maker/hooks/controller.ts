import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ActiveRecordService } from "../model/active-record-service";

export function useControllerComponent<T extends ActiveRecordService<any>>(model: T) {
  const [isShow, setIsShow] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (id) {
      model.show(id, (data: any) => {
        model.isShow = true;
        setIsShow(true);
        model.attributes.forEach((attr) => {
          if (attr.input) attr.input.readonly = true;
        });
      });
    }
  }, [id]);

  const redirect = () => router.push("/");

  const deleteItem = async (item: any) => {
    await model.delete(item);
    window.location.reload();
  };

  return { model, isShow, redirect, deleteItem };
}
