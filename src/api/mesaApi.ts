import api from "./api";

export type Mesa = {
    id: number;
    numero: number;
    estado: "DISPONIBLE" | "RESERVADO" | "OCUPADO";
};

export const listarMesas = async (): Promise<Mesa[]> => {
    const response = await api.get("/mesas",
        {
            withCredentials: true
        }
    );
    return response.data;
};


export const cambiarEstadoMesa = async (
    id: number,
    nuevoEstado: Mesa["estado"]
): Promise<Mesa> => {
    const response = await api.put(
        `/mesas/${id}/estado`,
        { nuevoEstado }, // JSON con clave 'nuevoEstado'
        { withCredentials: true } // Enviar cookies o credenciales
    );
    return response.data;
};

export const obtenerEstadoMesa = async (id: number): Promise<string> => {
    const response = await api.get(`/mesas/${id}/estado`, {
        withCredentials: true, // Si necesitas enviar credenciales
    });
    return response.data; // Devolvemos solo el estado como string
};