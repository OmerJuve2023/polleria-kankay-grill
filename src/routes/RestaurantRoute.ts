export const API_URL = 'http://localhost:8080/api'
/*export const API_URL = 'https://reporte-incidencias-production.up.railway.app/api/incidents';*/

export const LOGIN_ROUTE="/";
export const HOME_ROUTE="/home";


export const API_AUTH=API_URL+"/auth"
export const LOGIN_SERVICE_ROUTE= API_AUTH+"/login";
export const GET_IMAGE_AUTH_ROUTE=API_AUTH+"/downloadImage";
export const LOGOUT_SERVICE_ROUTE=API_AUTH+"/logout";