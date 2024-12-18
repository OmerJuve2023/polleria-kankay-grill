import React, {useEffect, useState} from 'react';
import {OrdenDetalle} from "../types/models.ts";
import {cerrarOrden, fetchOrdenes} from "../api/ordenApi.ts";
import {FaShoppingBag, FaSearch, FaFilter} from 'react-icons/fa';
import {ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Ordenes: React.FC = () => {
        const [ordenes, setOrdenes] = useState<OrdenDetalle[]>([]);
        const [filteredOrdenes, setFilteredOrdenes] = useState<OrdenDetalle[]>([]);
        const [loading, setLoading] = useState<boolean>(true);
        const [error, setError] = useState<string | null>(null);
        const [searchTerm, setSearchTerm] = useState('');
        const [selectedEstado, setSelectedEstado] = useState<string>('');

        useEffect(() => {
            const fetchData = async () => {
                try {
                    const data = await fetchOrdenes();
                    if (Array.isArray(data)) {
                        // Ordenar por ID de forma descendente (últimos primero)
                        const ordenedData = [...data].sort((a, b) => b.id - a.id);
                        setOrdenes(ordenedData);
                        setFilteredOrdenes(ordenedData);
                    } else {
                        throw new Error('Datos inválidos recibidos del servidor.');
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Error al obtener las órdenes');
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
        }, []);

        useEffect(() => {
            let result = [...ordenes];

            // Aplicar búsqueda
            if (searchTerm) {
                result = result.filter(orden =>
                    orden.id.toString().includes(searchTerm) ||
                    orden.productos.some(p => p.nombre.toLowerCase().includes(searchTerm.toLowerCase()))
                );
            }

            // Aplicar filtro por estado
            if (selectedEstado) {
                result = result.filter(orden => orden.estado === selectedEstado);
            }

            setFilteredOrdenes(result);
        }, [searchTerm, selectedEstado, ordenes]);

        const handleCerrarOrden = async (ordenId: number) => {
            try {
                await cerrarOrden(ordenId); // Llama al endpoint correspondiente en el backend.
                setOrdenes((prevOrdenes) =>
                    prevOrdenes.map((orden) =>
                        orden.id === ordenId ? {...orden, estado: "CERRADA"} : orden
                    )
                );
                alert("Orden cerrada exitosamente.");
            } catch (error) {
                console.error("Error al cerrar la orden:", error);
                alert("No se pudo cerrar la orden. Inténtalo nuevamente.");
            }
        };


        const getEstadoClass = (estado: string) => {
            return estado === 'ABIERTA' ? 'bg-warning' : 'bg-success';
        };

        if (loading) {
            return (
                <div className="d-flex justify-content-center align-items-center min-vh-100">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                </div>
            );
        }

        if (error) {
            return (
                <div className="alert alert-danger m-4" role="alert">
                    <h4 className="alert-heading">¡Error!</h4>
                    <p>{error}</p>
                </div>
            );
        }

        return (
            <div className="container py-4">
                <div className="row mb-4">
                    <div className="col">
                        <h1 className="display-4 d-flex align-items-center">
                            <FaShoppingBag className="me-3"/>
                            Listado de Órdenes
                        </h1>
                    </div>
                </div>

                <div className="row mb-4">
                    <div className="col-md-6">
                        <div className="input-group">
                        <span className="input-group-text">
                            <FaSearch/>
                        </span>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Buscar por ID o producto..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="input-group">
                        <span className="input-group-text">
                            <FaFilter/>
                        </span>
                            <select
                                className="form-select"
                                value={selectedEstado}
                                onChange={(e) => setSelectedEstado(e.target.value)}
                            >
                                <option value="">Todos los estados</option>
                                <option value="ABIERTA">Abierta</option>
                                <option value="CERRADA">Cerrada</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredOrdenes.length === 0 ? (
                    <div className="alert alert-info text-center" role="alert">
                        No se encontraron órdenes que coincidan con los criterios de búsqueda.
                    </div>
                ) : (
                    <div className="orden-list">
                        {filteredOrdenes.map((orden) => (

                            <div key={orden.id} className="card mb-4 orden-card">
                                <div className="card-header bg-light d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <h5 className="card-title mb-0 me-3">Orden #{orden.id}</h5>
                                        <span className={`badge ${getEstadoClass(orden.estado)}`}>
                                        {orden.estado}
                                    </span>
                                    </div>
                                    <span className="fs-5 fw-bold text-success">
                                    S/.{orden.total.toFixed(2)}
                                </span>
                                </div>
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-md-8">
                                            <h6 className="mb-3">Productos:</h6>
                                            <div className="table-responsive">
                                                <table className="table table-hover">
                                                    <thead className="table-light">
                                                    <tr>
                                                        <th>Producto</th>
                                                        <th>Precio</th>
                                                        <th>Cantidad</th>
                                                        <th>Subtotal</th>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {orden.productos.map((producto) => (
                                                        <tr key={producto.id}>
                                                            <td>{producto.nombre}</td>
                                                            <td>${producto.precio.toFixed(2)}</td>
                                                            <td>{producto.cantidad}</td>
                                                            <td>${(producto.precio * producto.cantidad).toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="orden-summary p-3 bg-light rounded">
                                                <h6 className="mb-3">Resumen de la Orden</h6>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Subtotal:</span>
                                                    <span>S/.{orden.total.toFixed(2)}</span>
                                                </div>
                                                <div className="d-flex justify-content-between mb-2">
                                                    <span>Impuestos:</span>
                                                    <span>S/.{(orden.total * 0.18).toFixed(2)}</span>
                                                </div>
                                                <hr/>
                                                <div className="d-flex justify-content-between fw-bold">
                                                    <span>Total:</span>
                                                    <span>S/.{(orden.total * 1.18).toFixed(2)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer bg-white d-flex justify-content-between">
                                    <small className="text-muted">
                                        Última actualización: {new Date().toLocaleDateString()}
                                    </small>
                                    {orden.estado === "ABIERTA" && (
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleCerrarOrden(orden.id)}
                                        >
                                            Cerrar Orden
                                        </button>
                                    )}
                                </div>
                            </div>

                        ))}
                    </div>
                )
                }
                <ToastContainer position="bottom-right"/>
            </div>
        )
            ;
    }
;

export default Ordenes;