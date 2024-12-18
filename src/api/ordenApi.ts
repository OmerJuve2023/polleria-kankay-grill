import api from "./api";
import {OrdenDetalle} from "../types/models.ts";

export type OrdenProducto = {
    productoId: number;
    cantidad: number;
};

export const agregarProductoOrden = async (ordenId: number, producto: OrdenProducto) => {
    const response = await api.post(`/ordenes/${ordenId}/agregar-producto`, producto,
        {
            withCredentials: true
        }
        );
    return response.data;
};

export const fetchOrdenes = async (): Promise<OrdenDetalle[]> => {
    const response = await api.get<OrdenDetalle[]>('/ordenes/obtener',
        {
            withCredentials:true
        }
        );
    return response.data;
};


export const cerrarOrden = async (ordenId: number) => {
    const response = await api.put(`/ordenes/cerrar/${ordenId}`, {}, { withCredentials: true });
    return response.data;
};
