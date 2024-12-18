import api from "./api";

export type Producto = {
    id: number;
    nombre: string;
    precio: number;
    categoria: string;
};

export const listarProductos = async (): Promise<Producto[]> => {
    const response = await api.get("/productos",
        {
            withCredentials: true
        }
        );
    return response.data;
};

export const agregarProducto = async (producto: Omit<Producto, "id">): Promise<Producto> => {
    const response = await api.post("/productos", producto,
        {
            withCredentials: true
        }
        );
    return response.data;
};
