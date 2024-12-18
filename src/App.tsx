import { Routes, Route } from 'react-router-dom';
import Login from "./components/Login.tsx";
import EstadoMesas from "./components/EstadoMesas.tsx";
import AgregarOrden from "./components/AgregarOrden.tsx";


const App = () => {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/home" element={<EstadoMesas />} />
            <Route path="/agregar-orden/:idMesa" element={<AgregarOrden />} />
        </Routes>
    );
};

export default App;
