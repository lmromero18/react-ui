import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { ActiveRecordService } from "../model/active-record-service";

export abstract class ControllerComponent<T extends ActiveRecordService<any>> {
    public timeout: number | null = null;
    public modelInstance!: T;
    public isShow = false;

    constructor(public modelClass: new () => T, public baseUrl: string) {
        this.modelInstance = new this.modelClass();
    }

    get model(): T {
        return this.modelInstance;
    }

    /**
     * Ejecuta un callback después de un tiempo determinado.
     */
    setTimeout(callback: CallableFunction, delay: number) {
        if (this.timeout) clearTimeout(this.timeout);
        this.timeout = window.setTimeout(callback, delay);
    }

    /**
     * Función de redirección después de guardar.
     */
    redirect(navigate: (path: string) => void) {
        navigate(this.baseUrl);
    }

    /**
     * Elimina un registro o cambia su estado a "EXCLUIDO".
     */
    async deleteItem(item: any) {
        await this.model.delete(item);
        window.location.reload();
    }

    /**
     * Formatea un número con separadores de miles.
     */
    numberFormat(value: string): string {
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
}

/**
 * 🔥 Hook para inicializar el formulario en componentes concretos.
 */
export function useControllerComponent<T extends ActiveRecordService<any>>(controller: ControllerComponent<T>) {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        if (id) {
            controller.model.show(id).then(() => {
                const showMode = location.pathname.includes("Detalle");
                setIsShow(showMode);
                controller.model.isShow = showMode;
                if (showMode) {
                    controller.model.attributes.forEach(attr => {
                        if (attr.input) attr.input.readonly = true;
                    });
                }
            });
        }
    }, [id, location.pathname]);

    return { isShow, navigate };
}
