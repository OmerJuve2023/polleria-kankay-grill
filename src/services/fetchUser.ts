import {GET_IMAGE_AUTH_ROUTE, LOGIN_SERVICE_ROUTE, LOGOUT_SERVICE_ROUTE} from "../routes/RestaurantRoute.ts";


export const fetchUser = async (username: string, password: string) => {
    const response = await fetch(LOGIN_SERVICE_ROUTE, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({username, password}),
    });

    if (!response.ok) {
        const errorData = await response.json(); // Intenta obtener el mensaje de error
        throw new Error(errorData.message || 'Credenciales inválidas. Inténtalo de nuevo.');
    }

    // Aquí agregamos el log para ver el cuerpo de la respuesta
    const data = await response.json();
    console.log("Respuesta de fetchUser:", data);  // Ver la estructura de la respuesta

    return data; // Asegúrate de que 'data' contenga el objeto de usuario
};

export const getImageUser = (id: number): Promise<string> =>
    fetch(GET_IMAGE_AUTH_ROUTE + "/" + id, {
        method: "GET",
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch image");
            }
            return response.blob();
        })
        .then(blob => {
            return URL.createObjectURL(blob);
        })
        .catch(error => {
            console.error("Error obteniendo la imagen:", error);
            return '';
        });
export const logoutService=()=>{
    fetch(LOGOUT_SERVICE_ROUTE,{
        method:"POST",
        credentials: "include"
    }).then(response=>{
        if(!response.ok){
            return null;
        }
    })
}