export interface Restaurant {
    id: number;
    name: string;
    address: string;
}

export interface User {
    id:number;
    username:string;
    email:string;
    firstName:string;
    lastName:string;
    company:string;
    phone:string;
    image?: File;
}
export interface ProductoDetalle {
    id: number;
    nombre: string;
    precio: number;
    cantidad: number;
}

export interface OrdenDetalle {
    id: number;
    total: number;
    estado: string;
    productos: ProductoDetalle[];
}
