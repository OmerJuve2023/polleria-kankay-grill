import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import {createHashRouter, RouterProvider} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

import './index.css';
import {UserProvider} from "./context/AuthContext.tsx";
import {HOME_ROUTE, LOGIN_ROUTE} from "./routes/RestaurantRoute.ts";
import Login from "./components/Login.tsx";
import AgregarOrden from "./components/AgregarOrden.tsx";
import Ordenes from "./components/Ordenes.tsx";
import AgregarProducto from "./components/AgregarProducto.tsx";
import ProductoList from "./components/ProductoList.tsx";
import EstadoMesas from "./components/EstadoMesas.tsx";

const router=createHashRouter([
    {
        path:LOGIN_ROUTE,
        element:<Login/>
    },
    {
        path:HOME_ROUTE,
        element:<EstadoMesas/>
    },
    {
        path:"/productos",
        element:<ProductoList/>
    },
    {
        path:"/agregar-orden/:idMesa",
        element:<AgregarOrden/>
    },
    {
        path:"/ordenes",
        element:<Ordenes/>
    },
    {
        path:"/addProducto",
        element:<AgregarProducto/>
    }

])

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserProvider>
            <RouterProvider router={router}/>
        </UserProvider>
    </StrictMode>,
);
